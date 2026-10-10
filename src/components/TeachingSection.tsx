import React from 'react';
import { useSite } from '../context/SiteContext';
import { BookOpen, Calendar, MapPin, Users, Download, ExternalLink, Plus } from 'lucide-react';

export const TeachingSection: React.FC = () => {
  const { siteData, setIsAdminOpen, setAdminTab } = useSite();
  const { courses } = siteData;

  return (
    <section id="teaching" className="py-16 md:py-20 bg-neutral-50/50 border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-200 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-dm text-neutral-400 block mb-1">
              Pedagogy & Curriculum
            </span>
            <h2 className="text-3xl md:text-4xl font-cormorant font-semibold text-neutral-900 tracking-tight">
              University Teaching & Course Instruction
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAdminTab('teaching');
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-500" />
              <span>Edit Course Offerings</span>
            </button>
          </div>
        </div>

        {/* Teaching Philosophy Note */}
        <div className="mb-10 p-5 bg-white border border-neutral-200 rounded text-neutral-700 font-dm text-xs md:text-sm leading-relaxed">
          <span className="font-semibold text-neutral-900 block mb-1">Pedagogical Philosophy</span>
          My classes emphasize rigorous empirical inquiry paired with rapid prototyping. We bridge human cognitive psychology with state-of-the-art interactive machine learning pipelines, preparing students to critically evaluate algorithmic societal consequences while creating inventive user experiences.
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-6 bg-white border border-neutral-200 rounded-md hover:border-neutral-300 transition-colors space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header line with Code & Level */}
                <div className="flex items-center justify-between text-xs font-dm">
                  <span className="font-mono font-bold text-neutral-900 text-sm tracking-tight">
                    {course.code}
                  </span>
                  <span className="text-neutral-500 font-medium">
                    {course.level}
                  </span>
                </div>

                <h3 className="text-lg font-cormorant font-semibold text-neutral-900 leading-snug">
                  {course.title}
                </h3>

                {/* Term, Schedule & Location (Unboxed text) */}
                <div className="space-y-1.5 text-xs font-dm text-neutral-500 pt-1 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{course.term} · {course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{course.location}</span>
                  </div>
                  {course.enrollmentCount && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="tabular-nums">Enrollment: ~{course.enrollmentCount} students</span>
                    </div>
                  )}
                </div>

                <p className="text-xs font-dm text-neutral-600 leading-relaxed pt-1">
                  {course.description}
                </p>
              </div>

              {/* Course Actions: Syllabus & Website links */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-dm">
                <div className="flex items-center gap-3">
                  <a
                    href={course.syllabusUrl || '#'}
                    className="inline-flex items-center gap-1 text-neutral-700 hover:text-neutral-950 underline underline-offset-2"
                  >
                    <Download className="w-3 h-3 text-neutral-500" />
                    <span>Syllabus PDF</span>
                  </a>
                  <a
                    href={course.courseWebsiteUrl || '#'}
                    className="inline-flex items-center gap-1 text-neutral-700 hover:text-neutral-950 underline underline-offset-2"
                  >
                    <ExternalLink className="w-3 h-3 text-neutral-500" />
                    <span>Canvas / Portal</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
