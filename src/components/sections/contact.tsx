"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D, Float } from "@react-three/drei";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle, XCircle } from "lucide-react";

const ContactScene = () => {
  return (
    <>
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} />

      <Float speed={5} rotationIntensity={1} floatIntensity={2}>
        <Text3D
          font="/fonts/Outfit.json"
          size={1}
          height={0.1}
          position={[-1.5, 0, 0]}
        >
          CONTACT
          <meshStandardMaterial color="#3E5F44" />
        </Text3D>
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={2}
      />
    </>
  );
};

export const Contact = () => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Replace this with your Formspree endpoint
      const res = await fetch("https://formspree.io/f/mayzkjqe", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="flex flex-col justify-center items-center px-4 py-8 lg:py-10 bg-background mx-auto"
    >
      <div className="grid grid-cols-1 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let&apos;s create something
            amazing together ✨
          </p>
        </div>

        {/* Left Side: 3D + Info */}
        <div className="w-full h-64 mb-8">
          <Canvas camera={{ position: [0, 0, 4], fov: 75 }}>
            <Suspense fallback={null}>
              <ContactScene />
            </Suspense>
          </Canvas>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-2">
          {/* Left Side: Form */}

          <div className="col-span-1 space-y-6">
            {[
              {
                icon: <Mail className="h-5 w-5 text-accent" />,
                title: "Email",
                value: "shendyppy@gmail.com",
              },
              {
                icon: <Phone className="h-5 w-5 text-accent" />,
                title: "Phone",
                value: "(+62) 85-156-683-808",
              },
              {
                icon: <MapPin className="h-5 w-5 text-accent" />,
                title: "Location",
                value: "Tangerang Selatan, Indonesia",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 hover:bg-accent/5 p-3 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-subheading text-lg text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Form */}
          <Card className="col-span-1 bg-card border-border shadow-xl">
            <CardHeader>
              <CardTitle className="font-subheading text-2xl text-card-foreground">
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Name
                    </label>
                    <Input name="name" placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block">
                    Subject
                  </label>
                  <Input
                    name="subject"
                    placeholder="Project inquiry"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Tell me about your project..."
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/80 transition"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                {/* Feedback */}
                {status === "success" && (
                  <p className="flex items-center text-green-600 text-sm mt-2">
                    <CheckCircle className="h-4 w-4 mr-1" /> Message sent!
                  </p>
                )}
                {status === "error" && (
                  <p className="flex items-center text-red-600 text-sm mt-2">
                    <XCircle className="h-4 w-4 mr-1" /> Oops, something went
                    wrong.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
