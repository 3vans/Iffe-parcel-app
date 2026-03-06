'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Sparkles, Package, ListChecks, Trophy, ArrowRight, Info, ChevronDown, Bird, Zap, Users as UsersIcon, Star, MapPin } from 'lucide-react';
import { calculatePricing, type Package as BuilderPackage, type Addon } from '@/lib/services/cms-service';
import { useToast } from '@/hooks/use-toast';

const categoryIcons: Record<string, any> = {
  'Wildlife': Bird,
  'Adventure': Zap,
  'Culture': UsersIcon,
  'Default': Star
};

interface CustomSafariBuilderProps {
  initialPackages: BuilderPackage[];
  initialAddons: Addon[];
}

export default function CustomSafariBuilder({ initialPackages, initialAddons }: CustomSafariBuilderProps) {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<BuilderPackage | null>(initialPackages[1] || initialPackages[0] || null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [expandedActivityCategory, setExpandedActivityCategory] = useState<string | null>(null);

  const selectedAddons = useMemo(() => 
    initialAddons.filter(a => selectedAddonIds.includes(a.id)),
    [initialAddons, selectedAddonIds]
  );

  const pricing = useMemo(() => {
    if (!selectedPackage) return null;
    return calculatePricing(selectedPackage, selectedAddons);
  }, [selectedPackage, selectedAddons]);

  const groupedActivities = useMemo(() => {
    const activities = initialAddons.filter(a => a.category === 'activity');
    const groups: Record<string, Record<string, Addon[]>> = {};
    
    activities.forEach(a => {
      const cat = a.subCategory || 'Other Activities';
      if (!groups[cat]) groups[cat] = {};
      
      const region = a.region || 'General';
      if (!groups[cat][region]) groups[cat][region] = [];
      groups[cat][region].push(a);
    });
    return groups;
  }, [initialAddons]);

  const otherAddons = useMemo(() => {
    return {
      luxury: initialAddons.filter(a => a.category === 'luxury'),
      extension: initialAddons.filter(a => a.category === 'extension'),
    };
  }, [initialAddons]);

  const toggleAddon = (id: string) => {
    setSelectedAddonIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleRegion = (items: Addon[]) => {
    const itemIds = items.map(i => i.id);
    const allInRegionSelected = itemIds.every(id => selectedAddonIds.includes(id));
    
    if (allInRegionSelected) {
      setSelectedAddonIds(prev => prev.filter(id => !itemIds.includes(id)));
    } else {
      setSelectedAddonIds(prev => Array.from(new Set([...prev, ...itemIds])));
    }
  };

  const handleBooking = () => {
    toast({
      title: "Custom Safari Request Prepared",
      description: "Our experts will contact you to finalize your bespoke itinerary.",
    });
  };

  if (!selectedPackage) return null;

  return (
    <section className="bg-stone-950/30 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-500">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-6">
          <Badge variant="outline" className="text-accent border-accent/40 bg-accent/5 px-6 py-1.5 uppercase tracking-[0.2em] text-[10px] font-black rounded-full">
            Bespoke Adventure
          </Badge>
          <h2 className="font-headline text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Custom</span> Safari
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Design your dream journey by starting with a base package and layering on the experiences that matter most to you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2 space-y-16">
            {/* Step 1: Base Package */}
            <div className="space-y-8">
              <h3 className="font-headline text-2xl font-bold text-white flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl"><Package className="h-6 w-6 text-accent" /></div>
                Step 1: Choose Your Foundation
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {initialPackages.map((pkg) => (
                  <Card 
                    key={pkg.id}
                    className={cn(
                      "cursor-pointer transition-all duration-500 bg-white/5 backdrop-blur-md border-white/10 hover:border-accent/50 group relative overflow-hidden",
                      selectedPackage?.id === pkg.id && "border-accent ring-1 ring-accent/50 scale-[1.05] bg-white/10 shadow-[0_0_30px_rgba(251,191,36,0.15)]"
                    )}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 transition-opacity duration-500",
                        selectedPackage?.id === pkg.id && "opacity-100"
                    )} />
                    <CardHeader className="p-6 relative z-10">
                      <CardTitle className="text-xl font-headline text-white group-hover:text-accent transition-colors">{pkg.name}</CardTitle>
                      <div className="text-3xl font-black text-accent mt-2">${pkg.basePrice}</div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 text-sm text-stone-400 relative z-10 font-medium">
                      {pkg.durationDays} Days Duration
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedPackage?.id === 'explorer' && (
                <div className="bg-blue-500/5 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4 animate-fade-in shadow-lg">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Info className="h-5 w-5 text-blue-400 shrink-0" />
                  </div>
                  <p className="text-blue-100/80 leading-relaxed font-medium">
                    <strong className="text-white block mb-1">Expert Suggestion</strong> 
                    Upgrade to the <span className="text-blue-400 font-bold">Adventurer Package</span> for a significantly deeper primate experience and better lodge locations.
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Activities */}
            <div className="space-y-10">
              <h3 className="font-headline text-2xl font-bold text-white flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl"><ListChecks className="h-6 w-6 text-accent" /></div>
                Step 2: Add Your Activities
              </h3>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(groupedActivities).map(([category, regions]) => {
                  const Icon = categoryIcons[category] || categoryIcons.Default;
                  const isExpanded = expandedActivityCategory === category;
                  
                  let totalCount = 0;
                  Object.values(regions).forEach(items => {
                    totalCount += items.filter(item => selectedAddonIds.includes(item.id)).length;
                  });

                  return (
                    <div key={category} className={cn("space-y-4 transition-all duration-500", isExpanded && "col-span-full")}>
                      <div 
                        className={cn(
                          "p-6 rounded-3xl border transition-all duration-500 cursor-pointer group relative overflow-hidden text-center",
                          isExpanded ? "bg-accent/20 border-accent/60 shadow-[0_0_20px_rgba(251,191,36,0.2)]" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                        )}
                        onClick={() => setExpandedActivityCategory(isExpanded ? null : category)}
                      >
                        <div className="flex flex-col items-center gap-3 relative z-10">
                          <div className={cn(
                            "p-3 rounded-2xl transition-all duration-500",
                            isExpanded ? "bg-accent text-stone-900 scale-110" : "bg-white/10 text-accent group-hover:scale-110"
                          )}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-black text-white uppercase tracking-widest">{category}</span>
                          {totalCount > 0 && (
                            <Badge className="bg-accent text-stone-900 font-black px-2 py-0.5 rounded-full text-[10px]">
                              {totalCount} SELECTED
                            </Badge>
                          )}
                          <ChevronDown className={cn("h-4 w-4 text-stone-500 transition-transform duration-500", isExpanded && "rotate-180 text-accent")} />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="bg-stone-950/40 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 animate-in slide-in-from-top-4 fade-in duration-300 w-full space-y-8">
                          {Object.entries(regions).map(([regionName, items]) => (
                            <div key={regionName} className="space-y-4">
                              {regionName !== 'General' && (
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-black text-stone-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <MapPin className="h-3 w-3 text-accent" /> {regionName} Region
                                  </h4>
                                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                    <Checkbox 
                                      id={`select-all-${regionName}`}
                                      checked={items.every(item => selectedAddonIds.includes(item.id))}
                                      onCheckedChange={() => toggleRegion(items)}
                                      className="h-3 w-3 data-[state=checked]:bg-accent data-[state=checked]:border-accent border-white/20"
                                    />
                                    <label htmlFor={`select-all-${regionName}`} className="text-[10px] font-black text-stone-400 uppercase tracking-wider cursor-pointer">
                                      All <span className="text-accent/60">(discount price)</span>
                                    </label>
                                  </div>
                                </div>
                              )}
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {items.map((item) => (
                                  <div 
                                    key={item.id}
                                    className={cn(
                                      "flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 cursor-pointer group hover:bg-white/5 border border-white/5 text-center",
                                      selectedAddonIds.includes(item.id) && "bg-white/10 border-accent/30"
                                    )}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleAddon(item.id);
                                    }}
                                  >
                                    <Checkbox 
                                      checked={selectedAddonIds.includes(item.id)}
                                      className="data-[state=checked]:bg-accent data-[state=checked]:border-accent h-4 w-4 border-white/30"
                                    />
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="text-[10px] font-bold text-stone-300 group-hover:text-white leading-tight">{item.name}</span>
                                      <span className="text-[10px] font-black text-accent">+${item.price}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Luxury & Extensions */}
            <div className="space-y-10 pt-8 border-t border-white/10">
              <h3 className="font-headline text-2xl font-bold text-white flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl"><Sparkles className="h-6 w-6 text-accent" /></div>
                Step 3: Enhance Your Comfort
              </h3>

              {Object.entries(otherAddons).map(([category, items]) => (
                <div key={category} className="space-y-6">
                  <h4 className="text-xs font-black text-stone-500 uppercase tracking-[0.3em] pl-1">{category}s</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {items.map((addon) => (
                      <div 
                        key={addon.id}
                        className={cn(
                          "flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer group relative overflow-hidden shadow-md",
                          selectedAddonIds.includes(addon.id) 
                            ? "bg-accent/10 border-accent/40 shadow-accent/5" 
                            : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                        )}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="flex items-center gap-4 relative z-10">
                          <Checkbox 
                            id={addon.id} 
                            checked={selectedAddonIds.includes(addon.id)}
                            onCheckedChange={() => toggleAddon(addon.id)}
                            className="data-[state=checked]:bg-accent data-[state=checked]:border-accent h-5 w-5 border-white/30"
                          />
                          <label className="text-sm font-bold text-stone-200 cursor-pointer group-hover:text-white transition-colors">{addon.name}</label>
                        </div>
                        <div className="text-sm font-black text-accent relative z-10 group-hover:scale-110 transition-transform">+${addon.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 space-y-8">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden relative rounded-[2rem] transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />
              <CardHeader className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="font-headline text-2xl text-white font-black tracking-tight">Summary</CardTitle>
                  {pricing?.tier === 'elite' && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-stone-950 border-none font-black px-3 py-1 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                      <Trophy className="h-3 w-3 mr-1.5" /> ELITE
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-stone-400 font-medium">Review your custom configuration</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between text-stone-300">
                    <span className="opacity-70">Base Foundation</span>
                    <span className="text-white">${pricing?.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span className="opacity-70">Custom Add-ons ({selectedAddonIds.length})</span>
                    <span className="text-white">${pricing?.addonsTotal.toLocaleString()}</span>
                  </div>
                  {pricing?.discountAmount ? (
                    <div className="flex justify-between text-green-400 bg-green-400/10 px-3 py-2 rounded-xl border border-green-400/20">
                      <span>Wildlife Bundle Discount</span>
                      <span className="font-black">-${pricing.discountAmount.toLocaleString()}</span>
                    </div>
                  ) : null}
                </div>

                <div className="pt-8 border-t border-white/10">
                  <div className="flex flex-col gap-2">
                    <span className="text-stone-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Investment</span>
                    <div className="text-5xl font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_25px_rgba(251,191,36,0.25)] transition-all duration-700">
                      ${pricing?.finalTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-stone-950/50 p-8 border-t border-white/5">
                <Button className="w-full bg-accent text-stone-950 hover:bg-white hover:scale-[1.02] font-black h-16 text-lg rounded-2xl transition-all shadow-[0_15px_30px_-5px_rgba(251,191,36,0.3)] active:scale-95" onClick={handleBooking}>
                  REQUEST ITINERARY <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </CardFooter>
            </Card>

            <div className="text-center px-6">
              <p className="text-[11px] text-stone-500 font-bold uppercase tracking-widest leading-relaxed">
                * All custom safaris are subject to seasonal availability. Prices represent estimated group investments per person.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
