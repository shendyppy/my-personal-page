"use client";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  Instagram,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const contactDetails = [
  {
    icon: <Mail className="h-5 w-5 text-blue-600" />,
    title: "Email",
    value: "shendyppy@gmail.com",
    action: "mailto:shendyppy@gmail.com",
  },
  {
    icon: <Phone className="h-5 w-5 text-green-600" />,
    title: "Phone",
    value: "(+62) 85-156-683-808",
    action: "tel:+6285156683808",
  },
];

const socialMedia = [
  {
    icon: Github,
    href: "https://github.com/shendyppy",
    color: "hover:text-gray-600",
    label: "GitHub",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/shendyppy/",
    color: "hover:text-blue-600",
    label: "LinkedIn",
  },
  {
    icon: Instagram,
    href: "#",
    color: "hover:text-pink-600",
    label: "Instagram",
  },
  {
    icon: Twitter,
    href: "#",
    color: "hover:text-blue-400",
    label: "Twitter",
  },
];

export const ContactInfo = () => {
  return (
    <div className="grid grid-cols-2 space-y-6 gap-x-6">
      {/* Contact Details */}
      <div className="grid gap-4">
        {contactDetails.map((item, i) => (
          <div
            key={i}
            className="group flex items-center space-x-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30 hover:bg-card/80 hover:border-border/60 transition-all duration-300 cursor-pointer"
            onClick={() => item.action && window.open(item.action)}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
            <div>
              <h4 className="font-subheading text-lg text-foreground">
                {item.title}
              </h4>
              <p className="text-muted-foreground">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Social Media */}
      <div className="space-y-4">
        <h4 className="font-subheading text-lg text-foreground text-center lg:text-left">
          Follow Me
        </h4>
        <div className="flex justify-center lg:justify-start gap-4">
          {socialMedia.map((social, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={`rounded-full w-12 h-12 p-0 border-border/50 hover:border-border transition-all duration-300 ${social.color}`}
              asChild
            >
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
