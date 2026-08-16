import fs from 'fs/promises';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'lib');
const CACHE_PATH = path.join(CACHE_DIR, 'cve-cache.json');

// Helper to load cache
async function loadCache() { 
  try {
    const data = await fs.readFile(CACHE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Helper to save cache
async function saveCache(cacheData: any) {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(CACHE_PATH, JSON.stringify(cacheData, null, 2), 'utf-8');
  } catch (err) {
    console.error("❌ Failed to write CVE cache:", err);
  }
}

// Fetch CVE data for a specific KB from Microsoft MSRC API
async function fetchMsrcForKb(kb: string) {
  const cleanKb = kb.replace("KB", "").trim();
  if (!cleanKb || isNaN(Number(cleanKb))) return [];
  
  const url = `https://api.msrc.microsoft.com/sug/v2.0/en-US/affectedProduct?%24filter=kbArticles/any(a%3A+a/articleName+eq+%27${cleanKb}%27)&$top=500`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      console.error(`❌ Failed to fetch CVEs for KB ${kb}: status ${res.status}`);
      return [];
    }
    const data = await res.json();
    return data.value || [];
  } catch (err) {
    console.error(`❌ Error fetching CVEs for KB ${kb}:`, err);
    return [];
  }
}

export async function enrichPatchesWithCve(patchDataList: any[]) {
  try {
    // 1. Extract unique KB IDs from available patches
    const uniqueKbs = new Set<string>();
    patchDataList.forEach(agent => {
      const available = agent.availablePatches || [];
      available.forEach((p: any) => {
        if (p.kbId && p.kbId.startsWith('KB')) {
          uniqueKbs.add(p.kbId);
        }
      });
    });

    const kbs = Array.from(uniqueKbs);
    const cveCache = await loadCache();
    let updated = false;

    // 2. Fetch missing KBs from Microsoft MSRC
    for (const kb of kbs) {
      if (!cveCache[kb]) {
        console.log(`[CVE Fetch] Fetching Microsoft MSRC CVEs for missing KB: ${kb}`);
        const records = await fetchMsrcForKb(kb);
        cveCache[kb] = records;
        updated = true;
        // Small delay to prevent rate limits
        await new Promise(r => setTimeout(r, 200));
      }
    }

    if (updated) {
      await saveCache(cveCache);
    }

    // 3. Map CVEs by KB ID
    const kbCveMap = new Map<string, any[]>();
    for (const kb of kbs) {
      const records = cveCache[kb] || [];
      const parsedCves: any[] = [];
      
      records.forEach((item: any) => {
        const cveId = item.cveNumber;
        if (!cveId) return;

        let baseScore = null;
        if (item.baseScore) {
          baseScore = parseFloat(item.baseScore);
        } else if (item.cvssScoreSets && item.cvssScoreSets.length > 0) {
          baseScore = parseFloat(item.cvssScoreSets[0].baseScore);
        }

        if (baseScore === null || isNaN(baseScore)) {
          const sev = (item.severity || "").toUpperCase();
          if (sev === "CRITICAL") baseScore = 9.0;
          else if (sev === "IMPORTANT") baseScore = 7.0;
          else if (sev === "MODERATE") baseScore = 4.0;
          else if (sev === "LOW") baseScore = 1.0;
          else baseScore = 0.0;
        }

        let level = "None";
        if (baseScore >= 9.0) level = "Critical";
        else if (baseScore >= 7.0) level = "Important";
        else if (baseScore >= 4.0) level = "Moderate";
        else if (baseScore > 0) level = "Low";

        parsedCves.push({
          cveId,
          severity: item.severity || "Unknown",
          impact: item.impact || "Unknown",
          product: item.product || "Unknown",
          baseScore,
          level
        });
      });

      kbCveMap.set(kb, parsedCves);
    }

    return {
      kbCveMap: Object.fromEntries(kbCveMap),
      cveCache
    };

  } catch (error) {
    console.error("❌ enrichPatchesWithCve Error:", error);
    return { kbCveMap: {}, cveCache: {} };
  }
}
