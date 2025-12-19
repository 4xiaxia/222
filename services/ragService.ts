import { openDB, IDBPDatabase } from 'idb';
import type { QAPair } from '../types';
import { initialRagData, allPoisMap } from '../data/mockData';

const DB_NAME = 'dongli-rag-db';
const STORE_NAME = 'qa_store';
const DB_VERSION = 4; // Bumped version to reload new Dongli Village data with historical figures

class RagService {
  private db: IDBPDatabase | null = null;

  async init() {
    if (this.db) return;

    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // If the store exists, delete it to ensure fresh data for the new village data
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME);
        }
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      },
    });

    // Load initial data if the store is empty or after an upgrade
    const count = await this.db.count(STORE_NAME);
    if (count === 0) {
      console.log('Initializing RAG database with Dongli Village data...');
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      await Promise.all(initialRagData.map(item => store.add(item)));
      await tx.done;
      console.log('RAG database initialized.');
    }
  }

  // Agent B: RAG Search Logic
  async search(question: string): Promise<{ answer: string; image?: string }> {
    if (!this.db) await this.init();
    if (!this.db) return { answer: "数据库初始化失败。" };

    const words = question.toLowerCase().replace(/[？?！!。，,]/g, '').split(/\s+/).filter(w => w.length > 0);
    const allItems: QAPair[] = await this.db.getAll(STORE_NAME);

    let bestMatch: QAPair | null = null;
    let maxScore = 0;

    for (const item of allItems) {
      const score = words.reduce((acc, word) => {
        return item.keywords.includes(word) ? acc + 1 : acc;
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && maxScore > 0) {
      let imageUrl: string | undefined = undefined;
      if (bestMatch.image) {
        imageUrl = bestMatch.image;
      } else if (bestMatch.poi) {
        // Find POI by name from the map's values
        const poiData = [...allPoisMap.values()].find(p => p.name === bestMatch.poi);
        if (poiData) {
          imageUrl = poiData.image;
        }
      }
      return { answer: bestMatch.answer, image: imageUrl };
    }

    return { answer: '这个问题我还不会，您可以试着问问关于“纪念馆”、“民宿”、“特产”或者“郑玉指”的问题～' };
  }

  // Called from Admin Panel
  async addKnowledge(poiName: string, content: string, images: string[]): Promise<{success: boolean, message: string}> {
    if (!this.db) await this.init();
     if (!this.db) return {success: false, message: "数据库初始化失败。"};

    const qaPairs = content.split('\n\n').map(block => {
      const lines = block.trim().split('\n');
      if (lines.length < 2 || !lines[0].toUpperCase().startsWith('Q:') || !lines.find(l => l.toUpperCase().startsWith('A:'))) {
        return null;
      }
      const qLine = lines[0];
      const aLines = lines.slice(1);
      const q = qLine.substring(2).trim();
      let a = aLines.map(l => l.replace(/^A:\s*/i, '')).join('\n').trim();
      
      let image: string | undefined = undefined;
      const imageMatch = a.match(/\[image:(\d+)\]/);
      if (imageMatch) {
        const imageIndex = parseInt(imageMatch[1], 10);
        if (images[imageIndex]) {
          image = images[imageIndex];
          a = a.replace(/\[image:(\d+)\]\s*/, ''); // Remove placeholder
        }
      }
      return { q, a, image };
    }).filter(Boolean);

    if (qaPairs.length === 0) {
        return { success: false, message: "格式错误。请确保每段都以 'Q:' 开头，并包含 'A:' 作为回答的开始。" };
    }

    try {
        const tx = this.db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        for (const pair of qaPairs) {
            if(pair){
                const id = `${poiName}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
                const keywords = pair.q.toLowerCase().split(/\s+/).filter(Boolean);
                await store.add({
                    id,
                    keywords,
                    answer: pair.a,
                    poi: poiName,
                    image: pair.image,
                });
            }
        }
        await tx.done;
        return { success: true, message: `成功添加 ${qaPairs.length} 条新知识！` };
    } catch (error) {
        console.error("Failed to add knowledge:", error);
        return { success: false, message: "写入数据库时发生错误。" };
    }
  }
}

export const ragService = new RagService();