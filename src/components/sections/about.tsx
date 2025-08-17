import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            About Me
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Passionate developer with expertise in modern web technologies and
            3D graphics
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-subheading text-2xl text-foreground mb-6">
              My Journey
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              I&apos;m a full-stack developer with a passion for creating
              immersive digital experiences. My expertise spans from traditional
              web development to cutting-edge 3D graphics and interactive
              applications.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              With a strong foundation in TypeScript, React, and Three.js, I
              love bringing ideas to life through code. I believe in the power
              of combining technical excellence with creative design to build
              memorable user experiences.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Problem Solving",
                "Creative Thinking",
                "Team Collaboration",
                "Continuous Learning",
              ].map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-subheading text-lg text-card-foreground mb-2">
                    Experience
                  </h4>
                  <p className="text-muted-foreground">
                    3+ years in web development
                  </p>
                </div>
                <div>
                  <h4 className="font-subheading text-lg text-card-foreground mb-2">
                    Focus Areas
                  </h4>
                  <p className="text-muted-foreground">
                    Full-Stack Development, 3D Graphics, UI/UX
                  </p>
                </div>
                <div>
                  <h4 className="font-subheading text-lg text-card-foreground mb-2">
                    Location
                  </h4>
                  <p className="text-muted-foreground">
                    Available for remote work
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
