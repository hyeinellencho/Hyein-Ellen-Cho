import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Mail, MapPin, Phone, Send, CheckCircle2, ExternalLink, Loader2, AlertCircle, Edit2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { siteData, setIsAdminOpen, setAdminTab } = useSite();
  const { profile } = siteData;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    affiliation: '',
    topic: 'Prospective PhD Student',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formspreeUrl = profile.formspreeEndpoint || 'https://formspree.io/f/xyekjebq';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('email', formState.email);
      formData.append('affiliation', formState.affiliation || 'N/A');
      formData.append('topic', formState.topic);
      formData.append('message', formState.message);
      formData.append('_subject', `[Academic Enquiry - ${formState.topic}] from ${formState.name}`);
      formData.append('_replyto', formState.email);

      const response = await fetch(formspreeUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json().catch(() => null);
        if (data && data.errors && data.errors.length > 0) {
          setSubmitError(data.errors.map((err: any) => err.message).join(', '));
        } else {
          setSubmitError('Failed to dispatch enquiry to Formspree. Please verify your connection.');
        }
      }
    } catch (err: any) {
      setSubmitError('Connection error occurred while sending. Please verify your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendTestMessage = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append('name', 'Test Visitor');
      formData.append('email', 'hyein.ellen.cho@gmail.com');
      formData.append('affiliation', 'Monash CollabAI Lab (Browser Test)');
      formData.append('topic', 'Website Data Verification');
      formData.append('message', 'This is an instant test message from the website contact form to verify that Formspree is receiving inquiries properly.');
      formData.append('_subject', '[CollabAI Lab] Formspree Test from Website');
      formData.append('_replyto', 'hyein.ellen.cho@gmail.com');

      const response = await fetch(formspreeUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        setSubmitError('Failed to send test message. Please verify the Formspree endpoint.');
      }
    } catch (err) {
      setSubmitError('Network error when dispatching test message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20 bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-200 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-dm text-neutral-400 block mb-1">
              Contact
            </span>
            <h2 className="text-3xl md:text-4xl font-cormorant font-semibold text-neutral-900 tracking-tight">
              Enquiries
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAdminTab('profile');
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>Edit Contact Info</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Office Information & Guidelines */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-md space-y-4">
              <h3 className="text-sm font-dm font-semibold uppercase tracking-wider text-neutral-900">
                Office & Postal Address
              </h3>

              <div className="space-y-3 text-xs md:text-sm font-dm text-neutral-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-900 block">{profile.institution}</strong>
                    <span>{profile.office}</span>
                    {profile.address && !profile.address.includes('Wellington Road') && (
                      <span className="block text-neutral-500">{profile.address}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-neutral-200/80">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-500 block text-xs">Primary Email</span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Note for Prospective Students & Fellows */}
            <div className="p-5 border border-neutral-200 rounded-md space-y-2 text-xs font-dm text-neutral-600 bg-white">
              <h4 className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">
                Note for Prospective PhD Applicants:
              </h4>
              <p className="leading-relaxed">
                {profile.prospectiveStudentsNote ||
                  'Please note that I am not accepting any research students until 2028.'}
              </p>
            </div>
          </div>

          {/* Right: Interactive Message Form */}
          <div className="lg:col-span-7">
            <div className="p-6 md:p-8 bg-white border border-neutral-200 rounded-md">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-neutral-900 mx-auto" />
                  <h3 className="text-xl font-cormorant font-semibold text-neutral-900">
                    Message Dispatched Successfully
                  </h3>
                  <p className="text-xs md:text-sm font-dm text-neutral-600 max-w-md mx-auto">
                    Thank you for reaching out to Prof. Cho's laboratory. Your message has been received and prioritised according to academic term commitments.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({
                        name: '',
                        email: '',
                        affiliation: '',
                        topic: 'Prospective PhD Student',
                        message: '',
                      });
                    }}
                    className="mt-4 px-4 py-2 text-xs font-dm font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Jane Smith"
                        className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none text-neutral-900 placeholder-neutral-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="your.email@university.edu"
                        className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none text-neutral-900 placeholder-neutral-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">
                        Institution / Affiliation
                      </label>
                      <input
                        type="text"
                        name="affiliation"
                        value={formState.affiliation}
                        onChange={(e) => setFormState({ ...formState, affiliation: e.target.value })}
                        placeholder="University, Institute, or Company"
                        className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none text-neutral-900 placeholder-neutral-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-dm font-medium text-neutral-700 block">
                        Enquiry Topic *
                      </label>
                      <select
                        name="topic"
                        value={formState.topic}
                        onChange={(e) => setFormState({ ...formState, topic: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none text-neutral-900"
                      >
                        <option value="Prospective PhD Student">Prospective PhD Student</option>
                        <option value="Research Collaboration">Research Collaboration</option>
                        <option value="Keynote / Invited Lecture">Keynote / Invited Lecture</option>
                        <option value="Press / Media Enquiry">Press / Media Enquiry</option>
                        <option value="General Academic Enquiry">General Academic Enquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-dm font-medium text-neutral-700 block">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Please summarise the context of your enquiry, relevant paper references, or proposed timeline..."
                      className="w-full px-3 py-2 text-xs font-dm bg-white border border-neutral-200 rounded focus:border-neutral-500 focus:outline-none text-neutral-900 placeholder-neutral-400"
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-xs font-dm text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Submission Error:</span>
                        <span>{submitError}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-dm font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 rounded transition-colors"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Dispatching Enquiry...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleSendTestMessage}
                        disabled={isSubmitting}
                        className="px-3 py-2 text-xs font-dm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded border border-neutral-200 transition-colors"
                        title="Send a 1-click test message to your Formspree inbox"
                      >
                        Send 1-Click Test
                      </button>
                    </div>

                    <span className="text-[11px] font-dm text-neutral-400">
                      Destination: <span className="font-mono text-neutral-700 font-medium">formspree.io/f/xyekjebq</span>
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
