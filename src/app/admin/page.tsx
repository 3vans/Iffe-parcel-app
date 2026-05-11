
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/stat-card";
import { Users, CheckCircle2, FileText, Activity, Hourglass, Database, Map, Percent, ArrowRight, CalendarClock } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchBasePackages, fetchCampaigns, fetchPromotions, fetchDepartures } from '@/lib/services/cms-service';

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState({ packages: 0, expeditions: 0, promos: 0, departures: 0 });

  useEffect(() => {
    const loadCounts = async () => {
      const [pkgs, camps, promos, departures] = await Promise.all([
        fetchBasePackages(),
        fetchCampaigns(),
        fetchPromotions(),
        fetchDepartures()
      ]);
      setCounts({
        packages: pkgs.length,
        expeditions: camps.length,
        promos: promos.length,
        departures: departures.length
      });
    };
    loadCounts();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline text-primary">Admin Overview</h1>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Inventory Items" value={counts.packages} icon={Database} description="Base safari foundations" />
        <StatCard title="Live Expeditions" value={counts.expeditions} icon={Map} description="Public tour itineraries" />
        <StatCard title="Active Promos" value={counts.promos} icon={Percent} description="Coupons and special deals" />
        <StatCard title="Departures" value={counts.departures} icon={CalendarClock} description="Upcoming scheduled trips" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="transition-all duration-300 ease-out hover:shadow-lg">
            <CardHeader>
                <CardTitle>Business Controls</CardTitle>
                <CardDescription>Quick actions to manage your tour offerings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/admin/inventory">Update Pricing & Add-ons <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/admin/expeditions">Create New Expedition <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/admin/expeditions">Schedule a Departure <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/admin/promotions">Manage Seasonal Offers <ArrowRight className="h-4 w-4" /></Link>
                </Button>
            </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-out hover:shadow-lg">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of recent platform management actions.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm">No recent activity to show.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
