import { describe, expect, it } from "vitest";
import { blogPosts } from "../posts";
import fs from "fs";
import path from "path";
import { articleBySlug } from "../[slug]/page";

describe("Blog Content Integrity", () => {
  it("ensures all blog posts in registry have a renderer", () => {
    // This test ensures we don't list a post in posts.ts that doesn't exist in page.tsx
    blogPosts.forEach((post) => {
      // Skip "coming soon" posts if they are not meant to have a renderer yet, 
      // but based on current code, even coming soon posts have a placeholder renderer.
      const renderer = articleBySlug[post.slug];
      expect(renderer, `Post "${post.title}" (${post.slug}) is missing a renderer in page.tsx`).toBeDefined();
    });
  });

  it("validates that code snippets do not use double-escaped newlines", () => {
    // This acts as a linter for the specific antipattern found: .join("\\n")
    const pagePath = path.resolve(__dirname, "../[slug]/page.tsx");
    const content = fs.readFileSync(pagePath, "utf-8");
    
    // We look for .join("\\n") or .join('\\n')
    // We strictly search for the specific double-escape sequence which causes the visual bug
    const doubleEscapedJoinDoubleQuote = /\.join\("\\\\n"\)/;
    const doubleEscapedJoinSingleQuote = /\.join\('\\\\n'\)/;

    expect(content).not.toMatch(doubleEscapedJoinDoubleQuote);
    expect(content).not.toMatch(doubleEscapedJoinSingleQuote);
  });

  it("validates image assets where present", () => {
    blogPosts.forEach((post) => {
      if (post.image) {
        expect(post.image.src).toBeTruthy();
        expect(post.image.alt).toBeTruthy();
      }
      // If no image, it's valid (handled by placeholder)
    });
  });
});
