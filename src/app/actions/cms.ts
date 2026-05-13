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

    // Translate title
    const translatedTitle = await translateContent(post.title, targetLocale);
    
    // Translate content
    const translatedContent = await translateContent(post.content, targetLocale);

    // Save translations
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
    const targetLang = sourceLang === 'id' ? 'en' : 'id';
    
    // We need to recursively translate all string values in the object
    const translatedData = await translateObject(data, targetLang);
    
    // Save to the other file
    const targetPath = path.join(process.cwd(), 'src', 'dictionaries', `${targetLang}.json`);
    await fs.writeFile(targetPath, JSON.stringify(translatedData, null, 2), 'utf8');
    
    revalidatePath('/');
    return { success: true, targetLang };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function translateObject(obj: any, targetLang: 'en' | 'id'): Promise<any> {
  if (typeof obj === 'string') {
    const result = await translateContent(obj, targetLang);
    return result.translatedText;
  }
  
  if (Array.isArray(obj)) {
    const translatedArray = [];
    for (const item of obj) {
      translatedArray.push(await translateObject(item, targetLang));
    }
    return translatedArray;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const translatedObj: any = {};
    for (const key in obj) {
      translatedObj[key] = await translateObject(obj[key], targetLang);
    }
    return translatedObj;
  }
  
  return obj;
}
