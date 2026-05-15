'use server';

import prisma from '@/lib/prisma';
import { PostStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { translateContent } from '@/lib/ai';
import fs from 'fs/promises';
import path from 'path';

export async function createPost(formData: FormData) {
  const schoolId = formData.get('schoolId') as string;
  const authorId = formData.get('authorId') as string;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const status = formData.get('status') as PostStatus;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        status,
        schoolId,
        authorId,
      },
    });

    revalidatePath(`/${schoolId}/cms/posts`);
    return { success: true, post };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function translatePostAction(postId: string, targetLocale: 'en' | 'id') {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new Error("Post not found");

    const translatedTitle = await translateContent(post.title, targetLocale);
    const translatedContent = await translateContent(post.content, targetLocale);

    await prisma.translation.createMany({
      data: [
        {
          locale: targetLocale,
          field: 'title',
          content: translatedTitle.translatedText,
          postId: post.id,
        },
        {
          locale: targetLocale,
          field: 'content',
          content: translatedContent.translatedText,
          postId: post.id,
        },
      ],
    });

    revalidatePath(`/cms/posts/${postId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePost(postId: string) {
  try {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    revalidatePath(`/cms/posts`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ── Dictionary Management ──

export async function getDictionary(lang: 'id' | 'en') {
  try {
    const filePath = path.join(process.cwd(), 'src', 'dictionaries', `${lang}.json`);
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to read dictionary ${lang}:`, error);
    return null;
  }
}

export async function saveDictionary(lang: 'id' | 'en', data: any) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'dictionaries', `${lang}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function autoTranslateDictionary(sourceLang: 'id' | 'en', data: any) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new Error("GEMINI_API_KEY is not configured in .env file.");
    }

    const targetLang = sourceLang === 'id' ? 'en' : 'id';
    
    // 1. First, persist the source language with the current data from the screen
    const sourcePath = path.join(process.cwd(), 'src', 'dictionaries', `${sourceLang}.json`);
    await fs.writeFile(sourcePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Source dictionary [${sourceLang}.json] updated before sync.`);
    
    // 2. Perform deep translation
    console.log(`Starting AI translation from [${sourceLang}] to [${targetLang}]...`);
    const translatedData = await translateObject(data, targetLang);
    
    // 3. Save the translated content to the target language file
    const targetPath = path.join(process.cwd(), 'src', 'dictionaries', `${targetLang}.json`);
    await fs.writeFile(targetPath, JSON.stringify(translatedData, null, 2), 'utf8');
    console.log(`Target dictionary [${targetLang}.json] synchronized successfully.`);
    
    revalidatePath('/');
    return { success: true, targetLang };
  } catch (error: any) {
    console.error('Auto-translate error:', error.message);
    return { success: false, error: error.message };
  }
}

async function translateObject(obj: any, targetLang: 'en' | 'id'): Promise<any> {
  // If it's a string, translate it
  if (typeof obj === 'string') {
    // Skip numbers, dates, empty strings, and technical IDs
    if (!obj.trim() || /^\d+([-/.]\d+)*$/.test(obj) || /^[0-9a-fA-F-]{36}$/.test(obj)) {
      return obj;
    }
    
    const result = await translateContent(obj, targetLang);
    // If translation failed, we'll keep the original string but it's better to log it
    if (!result.success) {
      console.warn(`Translation failed for string: "${obj.substring(0, 20)}...", keeping original.`);
    }
    return result.translatedText;
  }
  
  // If it's an array, translate each element
  if (Array.isArray(obj)) {
    const translatedArray = [];
    for (const item of obj) {
      translatedArray.push(await translateObject(item, targetLang));
    }
    return translatedArray;
  }
  
  // If it's an object, translate each property
  if (typeof obj === 'object' && obj !== null) {
    const translatedObj: any = {};
    for (const key in obj) {
      // Logic to avoid translating specific technical keys if needed
      // Currently translating all values
      translatedObj[key] = await translateObject(obj[key], targetLang);
    }
    return translatedObj;
  }
  
  return obj;
}
