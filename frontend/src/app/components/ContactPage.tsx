import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Send, Mail, Github, Linkedin, Twitter } from "lucide-react";
import { api } from "@/app/api";
import { toast } from "sonner";

export function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.contact.sendMessage({
        senderEmail: email,
        subject: "Contact Form Message", // Default subject
        message: message,
      });

      console.log("Form submitted:", { email, message });
      setSubmitted(true);
      
      toast.success("Mesaj gönderildi!", {
        description: "En kısa sürede dönüş yapacağım.",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setEmail("");
        setMessage("");
        setSubmitted(false);
      }, 3000);

    } catch (error: any) {
      console.error("Failed to send message", error);

      if (error.response) {
        if (error.response.status === 429) {
          toast.error("Hız Sınırı Aşıldı", {
            description: error.response.data || "Çok fazla mesaj gönderdiniz, lütfen bekleyin.",
          });
        } else if (error.response.status === 400) {
           // Handle Validation or Business Exception
           const data = error.response.data;
           if (data.errors) {
               // Validation ValidationProblemDetails
               const errorMessages = Object.values(data.errors).join(", ");
               toast.error("Hata", {
                   description: errorMessages,
               });
           } else if (data.detail) {
               // Business Exception ProblemDetails
               toast.error("Hata", {
                   description: data.detail,
               });
           } else {
             toast.error("Hata", {
               description: "Mesaj gönderilemedi. Lütfen alanları kontrol edin.",
             });
           }
        } else {
             toast.error("Sunucu Hatası", {
               description: "Bir şeyler ters gitti, lütfen daha sonra tekrar deneyin.",
             });
        }
      } else {
         toast.error("Bağlantı Hatası", {
           description: "Sunucuya ulaşılamıyor.",
         });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl tracking-tight mb-4">
              Let's Connect
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Have a project in mind or just want to chat about tech?
              Drop me a message and I'll get back to you soon.
            </p>
          </div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-muted-foreground">
                Your Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 bg-background border-border focus:border-foreground/20"
              />
            </div>

            {/* Message Textarea */}
            <div>
              <label htmlFor="message" className="block text-sm mb-2 text-muted-foreground">
                Your Message
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your project, idea, or just say hello..."
                required
                minLength={5}
                maxLength={500}
                rows={8}
                className="resize-none bg-background border-border focus:border-foreground/20"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-sm relative overflow-hidden group"
              disabled={isSubmitting || submitted}
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {/* Inner glow effect */}
              <div className="absolute inset-[2px] bg-gradient-to-b from-white/10 to-transparent rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              {isSubmitting ? (
                <>
                  <span className="animate-spin relative z-10">⏳</span>
                  <span className="relative z-10">Sending...</span>
                </>
              ) : submitted ? (
                <>
                  <span className="relative z-10">✓</span>
                  <span className="relative z-10">Message Sent!</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Send Message</span>
                </>
              )}
            </Button>
          </motion.form>

          {/* Divider */}
          <div className="relative my-16">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">Or connect via</span>
            </div>
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            <a
              href="mailto:mehmetarslancamehmet@gmail.com"
              className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all group"
            >
              <Mail className="w-6 h-6 group-hover:scale-110 group-hover:text-primary transition-all" />
              <span className="text-sm text-muted-foreground">Email</span>
            </a>
            <a
              href="https://github.com/postaldudegoespostal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all group"
            >
              <Github className="w-6 h-6 group-hover:scale-110 group-hover:text-primary transition-all" />
              <span className="text-sm text-muted-foreground">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/mehmet-arslanca-5618b32a6/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all group"
            >
              <Linkedin className="w-6 h-6 group-hover:scale-110 group-hover:text-primary transition-all" />
              <span className="text-sm text-muted-foreground">LinkedIn</span>
            </a>
          </motion.div>

        </motion.div>
      </section>
    </div>
  );
}