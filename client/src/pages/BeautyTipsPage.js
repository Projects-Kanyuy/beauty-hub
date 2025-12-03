import { useTranslation } from "react-i18next";
import BlogCard from "../components/BlogCard";
import Button from "../components/Button";
import { mockBlogPosts } from "../data/mockData";

const BeautyTipsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main">
            {t("beautyTips.title")}
          </h1>
          <p className="text-lg text-text-muted mt-4 max-w-3xl mx-auto">
            {t("beautyTips.subtitle")}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBlogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="secondary">{t("beautyTips.viewAll")}</Button>
        </div>
      </div>
    </div>
  );
};

export default BeautyTipsPage;
