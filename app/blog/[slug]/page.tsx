import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts, getPostBySlug } from "../posts";
import { buildCloudinaryUrl, CLOUDINARY_BLUR_DATA_URL } from "@/lib/cloudinary";

function formatDate(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input));
}

import { articleBySlug } from './articleData';

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Blog post not found — Eduardo Neto",
    };
  }

  return {
    title: `${post.title} — Eduardo Neto`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const renderArticle = articleBySlug[post.slug];
  const articleContent = renderArticle ? renderArticle() : null;
  const optimizedHero = post.image ? buildCloudinaryUrl(post.image.src, { width: 1400, quality: 75 }) : undefined;
  const isFlagship = post.slug === blogPosts[0]?.slug;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="m12 6-4 4 4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to all posts
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/55 backdrop-blur-sm shadow-xl shadow-black/40">
          <div className="flex flex-col gap-10 p-4 sm:p-8 lg:p-12">
            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <span>{formatDate(post.publishedAt)}</span>
                <span className="h-1 w-1 rounded-full bg-zinc-600" aria-hidden />
                <span>{post.readingTime}</span>
              </div>
              <h1 className="text-3xl font-bold text-white lg:text-4xl">{post.title}</h1>
              <p className="max-w-3xl text-base text-zinc-300">{post.excerpt}</p>
            </header>

            {post.image ? (
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-lg shadow-black/40">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={optimizedHero ?? post.image.src}
                    alt={post.image.alt}
                    fill
                    sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 70vw, 100vw"
                    className="h-full w-full object-cover"
                    priority={isFlagship}
                    placeholder="blur"
                    blurDataURL={CLOUDINARY_BLUR_DATA_URL}
                  />
                </div>
              </div>
            ) : null}

            {articleContent ? (
              <article className="min-w-0 space-y-8 text-base leading-relaxed text-zinc-200 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm">
                {articleContent}
              </article>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

