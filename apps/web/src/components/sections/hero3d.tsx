"use client";

import { Suspense, useState } from "react";
import { ArrowDown } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D, Environment, Float } from "@react-three/drei";

import { Button } from "@/components/ui/button";
import TypingText from "@/hooks/useTypingEffect";
import { useThemeContext } from "@/app/providers/ThemeProvider";
import { Theme, Trait } from "@/types";
import { useMediaQuery } from "@/hooks/useResponsive";
import { scrollToSection } from "@/lib/utils";
import { heroTraits, heroBio } from "@/data/hero";
import { traitColors, scene3DColors } from "@/constants/colors";
import { SECTION_IDS } from "@/constants/config";
import { TraitBadge } from "@/components/molecules/TraitBadge";

const FloatingCube = ({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) => {
  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Float>
  );
};

const Scene3D = ({ theme, isSmUp }: { theme: Theme; isSmUp: boolean }) => {
  const colors = scene3DColors[theme];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="studio" />

      {isSmUp && (
        <Text3D
          font="/fonts/Press Start 2P.json"
          size={1}
          height={0.2}
          position={[-1.5, 1.5, -1.2]}
        >
          Hi,
          <meshStandardMaterial color={colors.text} />
        </Text3D>
      )}

      <FloatingCube position={[3, 1, 0]} color={colors.cubes[0]} />
      <FloatingCube position={[-3, -1.5, -5]} color={colors.cubes[1]} />
      <FloatingCube position={[-3, -1, 1]} color={colors.cubes[2]} />
      <FloatingCube position={[2, -1.5, -1]} color={colors.cubes[3]} />

      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
};

export const Hero3D = () => {
  const { theme } = useThemeContext();
  const isSmUp = useMediaQuery({ min: 640 });
  const mobileToSm = useMediaQuery({ min: 0, max: 512 });

  const [traits, setTraits] = useState(heroTraits);
  const [shuffleKey, setShuffleKey] = useState(0);

  const shuffleArray = (array: typeof traits) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleShuffle = () => {
    setTraits(shuffleArray(traits));
    setShuffleKey((k) => k + 1);
  };

  const groupByType = (items: Trait[]) => {
    return items.reduce<Record<string, Trait[]>>((acc, trait) => {
      if (!acc[trait.type]) acc[trait.type] = [];
      acc[trait.type].push(trait);
      return acc;
    }, {});
  };

  const pickRandom = <T,>(arr: T[]): T | null => {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const getDisplayedTraits = (
    traits: Trait[],
    mobileToSm: boolean,
    maxCount: number
  ) => {
    if (!mobileToSm) return traits;

    const grouped = groupByType(traits);
    const picks: Trait[] = [];

    Object.values(grouped).forEach((list) => {
      const randomPick = pickRandom(list);
      if (randomPick) picks.push(randomPick);
    });

    const pickedLabels = new Set(picks.map((t) => t.label));
    const leftovers = traits.filter((t) => !pickedLabels.has(t.label));

    const shuffledLeftovers = leftovers.sort(() => Math.random() - 0.5);
    const slotsLeft = maxCount - picks.length;
    picks.push(...shuffledLeftovers.slice(0, slotsLeft));

    return picks;
  };

  const displayedTraits = getDisplayedTraits(traits, mobileToSm, 7);

  return (
    <section
      id="hero"
      className="w-full sm:h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <Scene3D theme={theme} isSmUp={isSmUp} />
          </Suspense>
        </Canvas>
      </div>

      <div className="flex flex-col justify-center text-center z-10 px-4 max-w-6xl mx-auto sm:mt-auto pt-20 pb-12 sm:py-20">
        <h1
          className={`font-heading text-4xl md:text-6xl lg:text-7xl mb-6 ${
            theme === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          <span className="text-accent">Shendy&apos;s here!</span>
        </h1>

        <TypingText text={heroBio} />

        {/* Shuffle button + traits */}
        <div
          key={shuffleKey}
          className="flex flex-wrap gap-2 justify-center transition-all duration-500 px-2 sm:px-4"
        >
          {displayedTraits.map((trait) => {
            const colorClasses =
              traitColors[trait.type][theme === "dark" ? "dark" : "light"];
            return (
              <TraitBadge
                key={trait.label}
                trait={trait}
                colorClasses={colorClasses}
                onClick={trait.type === "shuffle" ? handleShuffle : undefined}
              />
            );
          })}
        </div>

        <div className="flex justify-center space-x-6 mt-12 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToSection(SECTION_IDS.projects)}
            className={`animate-bounce cursor-pointer rounded-lg transition-all duration-300 transform
      ${
        theme === "dark"
          ? "border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-muted-foreground hover:scale-110"
          : "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:scale-110"
      }`}
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
