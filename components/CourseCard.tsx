import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IconBadge } from "./IconBadge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseProgress from "./CourseProgress";

interface Props {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}

const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: Props) => {
  return (
    <Link href={`/courses/${id}`} className="">
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" src={imageUrl} alt={title} />
        </div>

        <div className="flex flex-col pt-2">
          <h3 className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </h3>

          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>

          {progress !== null ? (
            <CourseProgress
              size="sm"
              value={progress}
              variant={progress === 100 ? "success" : "default"}
            />
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
