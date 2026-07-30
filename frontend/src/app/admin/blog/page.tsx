"use client";

import { AdminCRUD, Badge } from "@/components/admin/AdminCRUD";
import { ADMIN_LIST_ALL, BLOG_FIELDS, blogToForm, blogToPayload } from "@/lib/admin-resources";

type BlogRow = {
  id: string;
  title: string;
  category: string;
  published: boolean;
  views: number;
};

export default function AdminBlogPage() {
  return (
    <AdminCRUD<BlogRow>
      title="Blog Post"
      endpoint="/blog"
      listParams={ADMIN_LIST_ALL}
      fields={BLOG_FIELDS}
      toForm={blogToForm}
      toPayload={(f) => blogToPayload(f)}
      createLabel="Add Post"
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        {
          key: "published",
          label: "Status",
          render: (b) => (
            <Badge variant={b.published ? "default" : "secondary"}>
              {b.published ? "Published" : "Draft"}
            </Badge>
          ),
        },
        { key: "views", label: "Views" },
      ]}
    />
  );
}

