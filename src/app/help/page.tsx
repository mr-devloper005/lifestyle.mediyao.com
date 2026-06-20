import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const topics = [
  { title: 'Publishing Press Releases', description: 'How to prepare headlines, summaries, body content, and media before publishing.' },
  { title: 'Distribution & Visibility', description: 'How releases appear in your newsroom and improve discoverability.' },
  { title: 'Account & Access', description: 'Manage login, registration, and publishing access for your team.' },
  { title: 'Editorial Guidelines', description: 'Best practices for compliant, clear, and professional announcements.' },
]

const faqs = [
  {
    id: 'faq-1',
    question: 'How do I publish a new press release?',
    answer:
      'Open the create flow, add title, summary, content, media, and category, then submit your release.',
  },
  {
    id: 'faq-2',
    question: 'How do I search releases by category?',
    answer:
      'Use the Updates page filters: choose a category and optionally add a keyword for faster discovery.',
  },
  {
    id: 'faq-3',
    question: 'Can I edit a published release?',
    answer:
      'Yes. You can update release content from your management flow. Changes may take some time to reflect everywhere.',
  },
  {
    id: 'faq-4',
    question: 'What content is not allowed?',
    answer:
      'Misleading claims, spam, abusive content, and unlawful material are not allowed. Keep posts factual and professional.',
  },
  {
    id: 'faq-5',
    question: 'How can I contact support?',
    answer:
      'Use the Contact page, select your issue type, and include relevant release links for quicker resolution.',
  },
]

export default function HelpPage() {
  return (
    <PageShell
      title="Help Center"
      description="Find answers and guides for publishing, managing, and distributing press releases."
      actions={
        <Button asChild className="bg-[#5b46b2] text-white hover:bg-[#4b3993]">
          <Link href="/contact">Contact Support</Link>
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6 md:grid-cols-2">
          {topics.map((topic) => (
            <Card key={topic.title} className="border-[#d8cff9] bg-[#f3efff] transition-transform hover:-translate-y-1">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-[#2d2361]">{topic.title}</h2>
                <p className="mt-2 text-sm text-[#5d5491]">{topic.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-[#d8cff9] bg-[#efe9ff]">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#2d2361]">FAQ</h3>
            <Accordion type="single" collapsible className="mt-4">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-[#3b2f78]">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-[#5d5491]">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
