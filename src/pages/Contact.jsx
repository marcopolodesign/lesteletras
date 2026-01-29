import React, { useState } from 'react'
import { Container, Button } from '../components/ui'

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
  }

  return (
    <div className="bg-sand">
      {/* Header */}
      <section className="py-20 lg:py-24">
        <Container>
          <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-ink mb-6 tracking-tight">
            Get in touch
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-20 border-t border-stone/80 bg-cream">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink mb-8 tracking-tight">
                Contact information
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-sm font-semibold text-ink mb-1 uppercase tracking-wider text-muted">
                    Email
                  </h3>
                  <p className="text-ink text-sm">
                    <a href="mailto:hello@leste.com" className="hover:text-muted no-underline">
                      hello@leste.com
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-ink mb-1 uppercase tracking-wider text-muted">
                    Phone
                  </h3>
                  <p className="text-ink text-sm">
                    <a href="tel:+15550000000" className="hover:text-muted no-underline">
                      +1 (555) 000-0000
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-ink mb-1 uppercase tracking-wider text-muted">
                    Address
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    123 Design Street<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-ink mb-1 uppercase tracking-wider text-muted">
                    Business hours
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    Monday – Friday: 9 AM – 6 PM EST<br />
                    Saturday: 10 AM – 4 PM EST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink mb-8 tracking-tight">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-stone bg-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink text-ink placeholder:text-muted/70 text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-stone bg-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink text-ink placeholder:text-muted/70 text-sm"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-stone bg-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink text-ink placeholder:text-muted/70 text-sm"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-stone bg-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink text-ink placeholder:text-muted/70 text-sm resize-none"
                    placeholder="Your message here..."
                  />
                </div>
                <Button type="submit" size="lg" variant="primary" className="w-full">
                  Send message
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
