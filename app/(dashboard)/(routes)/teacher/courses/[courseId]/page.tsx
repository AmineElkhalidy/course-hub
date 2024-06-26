//@ts-nocheck
import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/IconBadge";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import AttachmentsForm from "./_components/AttachmentsForm";
import ChaptersForm from "./_components/ChaptersForm";
import Banner from "@/components/Banner";
import CourseActions from "./_components/Actions";

const CourseDetailsPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  // Check if there is a user + if this user is the one who created the course
  const { userId } = auth();

  if (!userId) return redirect("/");

  // Get the course from db
  const course = await db.course.findFirst({
    where: { id: params.courseId, userId },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // Get the categories from db
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const options = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  if (!course) return redirect("/");

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter?.isPublished),
  ];

  const totalFields = requiredFields.length;

  // ! this is genius
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is not published, It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {`${completionText}`}
            </span>
          </div>
          {/* //TODO: Add actions */}
          <CourseActions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2 font-medium">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-lg font-medium">Customize your course</h2>
            </div>

            <TitleForm initialData={course} courseId={course?.id} />
            <DescriptionForm initialData={course} courseId={course?.id} />
            <ImageForm initialData={course} courseId={course?.id} />
            <CategoryForm
              initialData={course}
              courseId={course?.id}
              options={options}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-lg font-medium">Course chapters</h2>
              </div>

              <ChaptersForm initialData={course} courseId={course?.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-lg font-medium">Sell your course</h2>
              </div>

              <PriceForm initialData={course} courseId={course?.id} />
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-lg font-medium">Resources & Attachments</h2>
              </div>
              <AttachmentsForm initialData={course} courseId={course?.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailsPage;
