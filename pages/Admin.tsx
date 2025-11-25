
import React, { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { ragService } from '../services/ragService';

// This is a global type because compressorjs is loaded from CDN
declare const Compressor: any;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

const RemoveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export default function Admin() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [poiName, setPoiName] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  const ADMIN_PASS = 'dongli2025';

  const login = () => {
    if (password === ADMIN_PASS) {
      setLoggedIn(true);
    } else {
      alert('密码错误！');
    }
  };

  const compressAndCrop = (file: File): Promise<File> => {
    // FIX: Explicitly specify the Promise generic type to `File`.
    // This helps TypeScript correctly infer the return type of the promise,
    // which was otherwise defaulting to `Promise<unknown>` and causing a downstream error.
    return new Promise<File>((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 600,
        mimeType: 'image/webp',
        success(result: Blob) {
          resolve(new File([result], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }));
        },
        // The 'unknown' type for 'err' was causing a type conflict, likely due to a subtle type inference issue with the untyped Compressor.js library. Changing to 'any' resolves the issue.
        error(err: any) {
            reject(err);
        }
      });
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
        const compressed = await Promise.all(files.map(f => compressAndCrop(f)));
        setImages(prev => [...prev, ...compressed]);
    } catch (error) {
        console.error("Image compression failed: ", error);
        alert("图片压缩失败，请选择其他图片。");
    }
    // Reset file input to allow selecting the same file again
    if (e.target) {
        e.target.value = '';
    }
  };
  
  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const uploadRAG = async () => {
    if (!poiName || !content) {
      alert('请填写景点名称和内容！');
      return;
    }
    if (!window.confirm(`确认上传新知识到【${poiName}】吗？此操作不可撤销！`)) return;

    setIsUploading(true);
    
    const base64Images = await Promise.all(images.map(fileToBase64));
    const result = await ragService.addKnowledge(poiName, content, base64Images);

    setIsUploading(false);
    alert(result.message);
    if(result.success){
        setContent('');
        setImages([]);
        setPoiName('');
    }
  };

  if (!loggedIn) {
    return (
      <div className="p-8 max-w-sm mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-6 text-center">管理员登录</h1>
        <input
          type="password"
          placeholder="请输入密码"
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
        />
        <button onClick={login} className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors">
          登录
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => setLocation('/')} className="mb-4 text-rose-500 hover:underline">{'< 返回首页'}</button>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">上传新知识 (RAG)</h1>

      <div className="space-y-6">
        <input
          placeholder="景点名称（如：辛亥纪念馆）"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={poiName}
          onChange={e => setPoiName(e.target.value)}
        />

        <textarea
          placeholder={"格式示例:\nQ: 郑玉指是谁？\nA: [image:0] 郑玉指是东里村华侨...\n\nQ: 旌义状在哪？\nA: 在侨光亭内..."}
          className="w-full p-3 border rounded-lg h-48 font-mono text-sm focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInput.current?.click()}
            className="w-full bg-blue-100 text-blue-700 py-3 rounded-lg hover:bg-blue-200 transition-colors"
          >
            选择图片（自动压缩+剪裁为WebP）
          </button>
          {images.length > 0 && 
            <div className="flex flex-wrap gap-4 mt-4 p-2 border rounded-lg bg-gray-50">
              {images.map((img, i) => (
                <div key={`${img.name}-${i}`} className="relative">
                  <img src={URL.createObjectURL(img)} alt={`preview-${i}`} className="w-20 h-20 object-cover rounded" />
                  <span className="absolute top-0 right-0 bg-black bg-opacity-60 text-white text-xs font-bold px-1.5 py-0.5 rounded-bl-md">{i}</span>
                  <button 
                    onClick={() => removeImage(i)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-md hover:bg-red-600 transition-colors"
                    aria-label={`Remove image ${i}`}
                   >
                     <RemoveIcon />
                   </button>
                </div>
              ))}
            </div>
          }
        </div>

        <button
          onClick={uploadRAG}
          disabled={isUploading}
          className="w-full bg-emerald-500 text-white py-4 rounded-lg text-lg font-medium hover:bg-emerald-600 transition-colors disabled:bg-emerald-300"
        >
          {isUploading ? '上传中...' : '确认上传（不可撤销）'}
        </button>

        <div className="bg-amber-50 p-4 rounded-lg text-sm border border-amber-200">
          <p className="font-medium text-amber-800">防呆提示：</p>
          <ul className="list-disc list-inside text-amber-700 mt-2 space-y-1">
            <li>上传前会弹出对话框二次确认。</li>
            <li>图片将自动压缩至800px宽，并转换为高效的WebP格式。</li>
            <li>内容必须包含 "Q:" 和 "A:" 引导词，且每个问答对用空行隔开。</li>
            <li>要为问答附加图片，请在回答开头使用 `[image:0]`、`[image:1]` 等标记，数字对应下方图片顺序。</li>
            <li>所有数据仅存储在用户本地浏览器中，永不上传至外部服务器。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
