"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D, Float } from "@react-three/drei";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactScene = () => {
  return (
    <>
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} />

      <Float speed={5} rotationIntensity={1} floatIntensity={2}>
        <Text3D
          font="/fonts/Outfit.json"
          size={0.7}
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
  return (
    <section id="contact" className="px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let&apos;s create something
            amazing together
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="h-64 mb-8">
              <Canvas camera={{ position: [0, 0, 4], fov: 75 }}>
                <Suspense fallback={null}>
                  <ContactScene />
                </Suspense>
              </Canvas>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-subheading text-lg text-foreground">
                    Email
                  </h3>
                  <p className="text-muted-foreground">shendyppy@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-subheading text-lg text-foreground">
                    Phone
                  </h3>
                  <p className="text-muted-foreground">(+62) 85-156-683-808</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-subheading text-lg text-foreground">
                    Location
                  </h3>
                  <p className="text-muted-foreground">
                    Tangerang Selatan, Indonesia
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="font-subheading text-2xl text-card-foreground">
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Name
                    </label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-2 block">
                      Email
                    </label>
                    <Input type="email" placeholder="your.email@example.com" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block">
                    Subject
                  </label>
                  <Input placeholder="Project inquiry" />
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell me about your project..."
                    rows={5}
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
