import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, MapPin, Flag, Flame, Star, Gauge, CalendarDays, Trophy } from "lucide-react";

const SERIES = {
  WEC: { name: "WEC", full: "World Endurance Championship", gradient: "from-sky-500 via-blue-700 to-indigo-950", accent: "bg-sky-400", icon: "24H" },
  F1: { name: "F1", full: "Formula 1", gradient: "from-red-500 via-red-800 to-zinc-950", accent: "bg-red-500", icon: "F1" },
  DTM: { name: "DTM", full: "Deutsche Tourenwagen Masters", gradient: "from-yellow-300 via-orange-600 to-zinc-950", accent: "bg-yellow-300", icon: "GT" },
  EGT: { name: "GT Europe", full: "GT World Challenge Europe", gradient: "from-emerald-400 via-teal-700 to-zinc-950", accent: "bg-emerald-400", icon: "GT3" },
  BGT: { name: "British GT", full: "British GT Championship", gradient: "from-blue-500 via-red-700 to-zinc-950", accent: "bg-blue-400", icon: "UK" },
  BIG: { name: "Big Races", full: "Major one-off races", gradient: "from-purple-500 via-fuchsia-700 to-zinc-950", accent: "bg-purple-400", icon: "★" },
};

const RACES = [
  ["f1-australia","F1","Australian Grand Prix","Round 1","Albert Park Circuit","Melbourne","Australia","2026-03-06","2026-03-08","Grand Prix weekend","Main","F1 weekend","Formula 1 season opener in Melbourne."],
  ["f1-china","F1","Chinese Grand Prix","Round 2","Shanghai International Circuit","Shanghai","China","2026-03-13","2026-03-15","Grand Prix weekend","Main","F1 weekend","Shanghai race weekend."],
  ["f1-japan","F1","Japanese Grand Prix","Round 3","Suzuka Circuit","Suzuka","Japan","2026-03-27","2026-03-29","Grand Prix weekend","Main","F1 weekend","Classic Suzuka weekend."],
  ["f1-miami","F1","Miami Grand Prix","Round 4","Miami International Autodrome","Miami Gardens, Florida","United States","2026-05-01","2026-05-03","Grand Prix weekend","Main","F1 weekend","Street-style Miami race weekend."],
  ["f1-canada","F1","Canadian Grand Prix","Round 5","Circuit Gilles Villeneuve","Montréal","Canada","2026-05-22","2026-05-24","Grand Prix weekend","Main","F1 weekend","Fast Circuit Gilles Villeneuve weekend."],
  ["f1-monaco","F1","Monaco Grand Prix","Round 6","Circuit de Monaco","Monte Carlo","Monaco","2026-06-05","2026-06-07","Grand Prix weekend","Must watch","Street race","The tightest and most famous F1 street race."],
  ["f1-barcelona","F1","Barcelona-Catalunya Grand Prix","Round 7","Circuit de Barcelona-Catalunya","Montmeló","Spain","2026-06-12","2026-06-14","Grand Prix weekend","Main","F1 weekend","Final Barcelona-Catalunya F1 race under the current contract."],
  ["f1-austria","F1","Austrian Grand Prix","Round 8","Red Bull Ring","Spielberg","Austria","2026-06-26","2026-06-28","Grand Prix weekend","Main","F1 weekend","Short lap, fast race, big hills."],
  ["f1-great-britain","F1","British Grand Prix","Round 9","Silverstone Circuit","Silverstone","Great Britain","2026-07-03","2026-07-05","Grand Prix weekend","Must watch","Home race","Silverstone F1 weekend."],
  ["f1-belgium","F1","Belgian Grand Prix","Round 10","Circuit de Spa-Francorchamps","Stavelot","Belgium","2026-07-17","2026-07-19","Grand Prix weekend","Must watch","Classic track","Spa F1 weekend with Eau Rouge, Raidillon and long straights."],
  ["f1-hungary","F1","Hungarian Grand Prix","Round 11","Hungaroring","Mogyoród","Hungary","2026-07-24","2026-07-26","Grand Prix weekend","Main","F1 weekend","Technical track near Budapest."],
  ["f1-netherlands","F1","Dutch Grand Prix","Round 12","Circuit Zandvoort","Zandvoort","Netherlands","2026-08-21","2026-08-23","Grand Prix weekend","Main","Sprint weekend","Banked corners and huge Dutch crowd."],
  ["f1-italy","F1","Italian Grand Prix","Round 13","Monza Circuit","Monza","Italy","2026-09-04","2026-09-06","Grand Prix weekend","Must watch","Temple of Speed","Fast Monza race weekend."],
  ["f1-spain","F1","Spanish Grand Prix","Round 14","Madring","Madrid","Spain","2026-09-11","2026-09-13","Grand Prix weekend","Main","New venue","New Madrid race weekend, subject to FIA circuit homologation."],
  ["f1-azerbaijan","F1","Azerbaijan Grand Prix","Round 15","Baku City Circuit","Baku","Azerbaijan","2026-09-24","2026-09-26","Grand Prix weekend","Main","Street race","Fast Baku street race weekend."],
  ["f1-singapore","F1","Singapore Grand Prix","Round 16","Marina Bay Street Circuit","Singapore","Singapore","2026-10-09","2026-10-11","Grand Prix weekend","Must watch","Night race","Night street race and sprint weekend."],
  ["f1-usa","F1","United States Grand Prix","Round 17","Circuit of The Americas","Austin, Texas","United States","2026-10-23","2026-10-25","Grand Prix weekend","Main","F1 weekend","COTA race weekend."],
  ["f1-mexico","F1","Mexico City Grand Prix","Round 18","Autódromo Hermanos Rodríguez","Mexico City","Mexico","2026-10-30","2026-11-01","Grand Prix weekend","Main","F1 weekend","High-altitude race in Mexico City."],
  ["f1-brazil","F1","São Paulo Grand Prix","Round 19","Interlagos","São Paulo","Brazil","2026-11-06","2026-11-08","Grand Prix weekend","Must watch","Classic track","Interlagos race weekend."],
  ["f1-las-vegas","F1","Las Vegas Grand Prix","Round 20","Las Vegas Strip Circuit","Las Vegas, Nevada","United States","2026-11-19","2026-11-21","Grand Prix weekend","Main","Night race","Vegas night race weekend."],
  ["f1-qatar","F1","Qatar Grand Prix","Round 21","Lusail International Circuit","Lusail","Qatar","2026-11-27","2026-11-29","Grand Prix weekend","Main","F1 weekend","Lusail race weekend."],
  ["f1-abu-dhabi","F1","Abu Dhabi Grand Prix","Round 22","Yas Marina Circuit","Abu Dhabi","United Arab Emirates","2026-12-04","2026-12-06","Grand Prix weekend","Must watch","Season finale","F1 season finale at Yas Marina."],

  ["wec-imola","WEC","6 Hours of Imola","Round 1","Autodromo Internazionale Enzo e Dino Ferrari","Imola","Italy","2026-04-17","2026-04-19","6 hour race","Main","Endurance","WEC round at Imola."],
  ["wec-spa","WEC","6 Hours of Spa-Francorchamps","Round 2","Circuit de Spa-Francorchamps","Stavelot","Belgium","2026-05-07","2026-05-09","6 hour race","Must watch","Endurance","WEC race at Spa."],
  ["wec-le-mans","WEC","24 Hours of Le Mans","Round 3","Circuit de la Sarthe","Le Mans","France","2026-06-10","2026-06-14","24 hour race","Must watch","Mega race","The biggest endurance race of the year.",true],
  ["wec-sao-paulo","WEC","Rolex 6 Hours of São Paulo","Round 4","Interlagos","São Paulo","Brazil","2026-07-10","2026-07-12","6 hour race","Main","Endurance","WEC returns to Interlagos."],
  ["wec-cota","WEC","Lone Star Le Mans","Round 5","Circuit of The Americas","Austin, Texas","United States","2026-09-04","2026-09-06","6 hour race","Main","Endurance","WEC race at COTA."],
  ["wec-fuji","WEC","6 Hours of Fuji","Round 6","Fuji Speedway","Oyama","Japan","2026-09-25","2026-09-27","6 hour race","Main","Endurance","WEC race at Fuji Speedway."],
  ["wec-qatar","WEC","Qatar 1812 Km","Round 7","Lusail International Circuit","Lusail","Qatar","2026-10-22","2026-10-24","1812 km race","Main","Endurance","Qatar WEC round at Lusail."],
  ["wec-bahrain","WEC","8 Hours of Bahrain","Round 8","Bahrain International Circuit","Sakhir","Bahrain","2026-11-05","2026-11-07","8 hour race","Must watch","Season finale","WEC season finale."],

  ["dtm-red-bull-ring","DTM","Red Bull Ring","Races 1 & 2","Red Bull Ring","Spielberg","Austria","2026-04-24","2026-04-26","Two-race weekend","Main","DTM weekend","DTM season opener in Austria."],
  ["dtm-zandvoort","DTM","Circuit Zandvoort","Races 3 & 4","Circuit Zandvoort","Zandvoort","Netherlands","2026-05-22","2026-05-24","Two-race weekend","Main","DTM weekend","DTM race weekend on the Dutch coast."],
  ["dtm-lausitzring","DTM","Lausitzring","Races 5 & 6","Lausitzring","Klettwitz","Germany","2026-06-19","2026-06-21","Two-race weekend","Main","DTM weekend","DTM weekend at the Lausitzring."],
  ["dtm-norisring","DTM","Norisring","Races 7 & 8","Norisring","Nuremberg","Germany","2026-07-03","2026-07-05","Two-race weekend","Must watch","Street circuit","Short, fast street-circuit DTM weekend."],
  ["dtm-oschersleben","DTM","Oschersleben","Races 9 & 10","Motorsport Arena Oschersleben","Oschersleben","Germany","2026-07-24","2026-07-26","Two-race weekend","Main","DTM weekend","DTM race weekend at Oschersleben."],
  ["dtm-nurburgring","DTM","Nürburgring","Races 11 & 12","Nürburgring","Nürburg","Germany","2026-08-14","2026-08-16","Two-race weekend","Main","DTM weekend","DTM business-end race weekend at the Nürburgring."],
  ["dtm-sachsenring","DTM","Sachsenring","Races 13 & 14","Sachsenring","Hohenstein-Ernstthal","Germany","2026-09-11","2026-09-13","Two-race weekend","Main","DTM weekend","Late-season DTM weekend at Sachsenring."],
  ["dtm-hockenheim","DTM","Hockenheim","Races 15 & 16","Hockenheimring","Hockenheim","Germany","2026-10-09","2026-10-11","Two-race weekend","Must watch","Season finale","DTM season finale at Hockenheim."],

  ["gtwc-paul-ricard","EGT","Circuit Paul Ricard","Round 1","Circuit Paul Ricard","Le Castellet","France","2026-04-10","2026-04-12","Endurance Cup","Main","GT3 endurance","GT World Challenge Europe endurance opener."],
  ["gtwc-brands","EGT","Brands Hatch","Round 2","Brands Hatch","Kent","Great Britain","2026-05-02","2026-05-03","Sprint Cup","Main","GT3 sprint","UK sprint round on the Brands Hatch GP circuit."],
  ["gtwc-monza","EGT","Monza","Round 3","Monza Circuit","Monza","Italy","2026-05-28","2026-05-31","Endurance Cup","Must watch","GT3 endurance","Big GT3 grid at Monza."],
  ["gtwc-spa24","EGT","CrowdStrike 24 Hours of Spa","Round 4","Circuit de Spa-Francorchamps","Stavelot","Belgium","2026-06-24","2026-06-28","24 hour race","Must watch","Mega race","One of the biggest GT3 endurance races in the world.",true],
  ["gtwc-misano","EGT","Misano","Round 5","Misano World Circuit Marco Simoncelli","Misano Adriatico","Italy","2026-07-17","2026-07-19","Sprint Cup","Main","GT3 sprint","GT World Challenge Europe sprint round at Misano."],
  ["gtwc-magny-cours","EGT","Magny-Cours","Round 6","Circuit de Nevers Magny-Cours","Magny-Cours","France","2026-07-31","2026-08-02","Sprint Cup","Main","GT3 sprint","GT3 sprint weekend in France."],
  ["gtwc-nurburgring","EGT","Nürburgring","Round 7","Nürburgring","Nürburg","Germany","2026-08-28","2026-08-30","Endurance Cup","Main","GT3 endurance","GT World Challenge Europe endurance round."],
  ["gtwc-zandvoort","EGT","Zandvoort","Round 8","Circuit Zandvoort","Zandvoort","Netherlands","2026-09-18","2026-09-20","Sprint Cup","Main","GT3 sprint","GT3 sprint round on the Dutch coast."],
  ["gtwc-barcelona","EGT","Barcelona","Round 9","Circuit de Barcelona-Catalunya","Montmeló","Spain","2026-10-02","2026-10-04","Sprint Cup","Main","GT3 sprint","GT World Challenge Europe sprint round in Spain."],
  ["gtwc-portimao","EGT","Portimão","Round 10","Algarve International Circuit","Portimão","Portugal","2026-10-16","2026-10-18","Endurance Cup","Must watch","Season finale","GT World Challenge Europe season finale."],

  ["bgt-silverstone","BGT","Silverstone 500","Round 1","Silverstone Circuit","Silverstone","Great Britain","2026-04-24","2026-04-26","1x 3-hour race","Must watch","British GT","British GT showpiece opens the season."],
  ["bgt-oulton","BGT","Oulton Park","Rounds 2 & 3","Oulton Park","Cheshire","Great Britain","2026-05-22","2026-05-25","2x 1-hour races","Main","British GT","Bank Holiday British GT weekend."],
  ["bgt-spa","BGT","Spa-Francorchamps","Round 4","Circuit de Spa-Francorchamps","Stavelot","Belgium","2026-06-20","2026-06-21","Format TBC","Must watch","British GT","British GT overseas round at Spa."],
  ["bgt-snetterton","BGT","Snetterton","Rounds 5 & 6","Snetterton 300","Norfolk","Great Britain","2026-08-15","2026-08-16","2x 1-hour races","Main","British GT","British GT sprint races at Snetterton."],
  ["bgt-donington","BGT","Donington Park","Round 7","Donington Park","Leicestershire","Great Britain","2026-09-05","2026-09-06","Format TBC","Main","British GT","Late-season British GT round."],
  ["bgt-brands","BGT","Brands Hatch","Round 8","Brands Hatch","Kent","Great Britain","2026-09-26","2026-09-27","1x 2-hour race","Must watch","Season finale","British GT season finale."],

  ["big-daytona24","BIG","Rolex 24 At Daytona","Major race","Daytona International Speedway","Daytona Beach, Florida","United States","2026-01-21","2026-01-25","24 hour race","Must watch","Mega race","Major IMSA endurance race and one of the biggest 24-hour races.",true],
  ["big-bathurst12","BIG","Bathurst 12 Hour","Major race","Mount Panorama Circuit","Bathurst, New South Wales","Australia","2026-02-11","2026-02-15","12 hour race","Must watch","GT endurance","Huge GT race at Mount Panorama.",true],
  ["big-n24","BIG","24 Hours of Nürburgring","Major race","Nürburgring Nordschleife","Nürburg","Germany","2026-05-14","2026-05-17","24 hour race","Must watch","Mega race","Brutal 24-hour race on the Nordschleife.",true],
  ["big-indy500","BIG","Indianapolis 500","Major race","Indianapolis Motor Speedway","Speedway, Indiana","United States","2026-05-24","2026-05-24","500 mile race","Must watch","Oval classic","The biggest IndyCar race of the year.",true],
].map(([id, series, title, round, track, location, country, startDate, endDate, time, priority, status, notes, major]) => ({ id, series, title, round, track, location, country, startDate, endDate, time, priority, status, notes, major: Boolean(major) }));

const todayStart = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const parseDate = (dateString) => new Date(`${dateString}T00:00:00`);
const isPast = (race) => parseDate(race.endDate) < todayStart();
const isLiveNow = (race) => parseDate(race.startDate) <= todayStart() && parseDate(race.endDate) >= todayStart();

function getDaysAway(race) {
  const diff = Math.ceil((parseDate(race.startDate) - todayStart()) / 86400000);
  if (isLiveNow(race)) return "This weekend";
  if (diff === 1) return "Tomorrow";
  if (diff === 0) return "Today";
  if (diff < 0) return "Finished";
  return `${diff} days away`;
}

function formatDateRange(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (startDate === endDate) return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "2-digit", month: "short" }).format(start);
  if (start.getMonth() === end.getMonth()) {
    return `${new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(start)}–${new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(end)}`;
  }
  return `${new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(start)}–${new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(end)}`;
}

function RaceCard({ race, index, faded }) {
  const series = SERIES[race.series];
  const past = faded || isPast(race);
  const live = isLiveNow(race);

  return (
    <motion.article initial={{ opacity: 0, y: 18 }} animate={{ opacity: past ? 0.46 : 1, y: 0 }} transition={{ delay: index * 0.025 }} className={`group overflow-hidden rounded-3xl border bg-zinc-950 shadow-2xl shadow-black/30 ${past ? "border-white/5 grayscale" : "border-white/10"}`}>
      <div className={`relative min-h-48 bg-gradient-to-br ${series.gradient} p-5`}>
        <div className="absolute inset-0 opacity-20"><div className="h-full w-full bg-[linear-gradient(135deg,transparent_0_20%,rgba(255,255,255,.25)_20%_24%,transparent_24%_44%,rgba(255,255,255,.18)_44%_48%,transparent_48%_100%)] bg-[length:52px_52px]" /></div>
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white/90 backdrop-blur"><span className={`h-2 w-2 rounded-full ${series.accent}`} />{series.full}</div>
            <h2 className="max-w-md text-2xl font-black uppercase leading-none tracking-tight text-white md:text-3xl">{race.title}</h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-white/70">{race.round}</p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-xl font-black text-white shadow-xl backdrop-blur">{series.icon}</div>
        </div>
        <div className="relative mt-8 grid grid-cols-2 gap-3 text-sm text-white md:grid-cols-4">
          <Info icon={<Clock />} main={getDaysAway(race)} sub={formatDateRange(race.startDate, race.endDate)} />
          <Info icon={<MapPin />} main={race.track} sub={race.location} />
          <Info icon={<Flag />} main={race.time} sub={race.country} />
          <Info icon={<Star />} main={race.priority} sub="Priority" />
        </div>
      </div>
      <div className="border-t border-white/10 bg-zinc-950 p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${past ? "bg-zinc-700 text-zinc-300" : "bg-white text-zinc-950"}`}>{past ? "Finished" : live ? "On now" : race.status}</span>
          {race.major && <span className="inline-flex items-center gap-1 rounded-full bg-yellow-300 px-3 py-1 text-xs font-black uppercase text-zinc-950"><Trophy className="h-3 w-3" /> Mega</span>}
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold uppercase text-zinc-400">{series.name}</span>
        </div>
        <p className="text-sm leading-6 text-zinc-300">{race.notes}</p>
      </div>
    </motion.article>
  );
}

function Info({ icon, main, sub }) {
  return <div className="rounded-2xl bg-black/30 p-3 backdrop-blur">{React.cloneElement(icon, { className: "mb-2 h-4 w-4" })}<p className="font-bold">{main}</p><p className="text-white/70">{sub}</p></div>;
}

export default function App() {
  const [activeSeries, setActiveSeries] = useState("ALL");
  const [query, setQuery] = useState("");
  const allUpcoming = RACES.filter((race) => !isPast(race)).sort((a, b) => parseDate(a.startDate) - parseDate(b.startDate));
  const nextRace = allUpcoming[0];

  const filteredRaces = useMemo(() => {
    const base = activeSeries === "ALL" ? RACES.filter((race) => !isPast(race)) : RACES.filter((race) => race.series === activeSeries);
    return base.filter((race) => `${race.title} ${race.round} ${race.track} ${race.location} ${race.country} ${SERIES[race.series].full}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => parseDate(a.startDate) - parseDate(b.startDate));
  }, [activeSeries, query]);

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none fixed inset-0 opacity-40"><div className="absolute left-[-10%] top-[-20%] h-96 w-96 rounded-full bg-red-600 blur-3xl" /><div className="absolute right-[-10%] top-20 h-96 w-96 rounded-full bg-blue-700 blur-3xl" /><div className="absolute bottom-[-20%] left-1/3 h-96 w-96 rounded-full bg-yellow-500 blur-3xl" /></div>
      <section className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <header className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-zinc-300"><Gauge className="h-4 w-4 text-red-400" />Race Hub 2026</div><h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-7xl">All your racing in one pile</h1><p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">The All tab only shows what is still coming up. Open a series tab to see the full 2026 list, with finished weekends greyed out.</p></div>
            <div className="grid gap-3 sm:grid-cols-3 lg:w-[460px]"><Stat value={allUpcoming.length} label="Still upcoming" /><Stat value={Object.keys(SERIES).length} label="Series tabs" /><Stat value={RACES.filter(isPast).length} label="Greyed out" /></div>
          </div>
        </header>

        {nextRace && <section className="mb-8 rounded-[2rem] border border-white/10 bg-black/40 p-5 shadow-2xl backdrop-blur md:p-6"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-600/30"><Flame className="h-7 w-7" /></div><div><p className="text-sm font-bold uppercase tracking-[0.22em] text-zinc-400">Next thing to watch</p><h2 className="text-2xl font-black uppercase">{nextRace.title}</h2><p className="text-sm text-zinc-400">{SERIES[nextRace.series].full} • {nextRace.track}, {nextRace.location}</p></div></div><div className="rounded-2xl bg-white px-5 py-3 text-zinc-950"><p className="text-sm font-bold uppercase text-zinc-500">Starts</p><p className="text-xl font-black">{getDaysAway(nextRace)}</p></div></div></section>}

        <section className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search series, track, place, country..." className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 pr-4 font-semibold text-white outline-none ring-red-500/40 placeholder:text-zinc-600 focus:ring-4" /></div>
          <div className="flex flex-wrap gap-2"><Filter active={activeSeries === "ALL"} onClick={() => setActiveSeries("ALL")}>All upcoming</Filter>{Object.entries(SERIES).map(([key, series]) => <Filter key={key} active={activeSeries === key} onClick={() => setActiveSeries(key)}>{series.name}</Filter>)}</div>
        </section>

        <div className="mb-5 flex items-center justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.22em] text-zinc-500">{activeSeries === "ALL" ? "Upcoming pile" : `${SERIES[activeSeries].full} full 2026 list`}</p><h2 className="text-3xl font-black uppercase">{activeSeries === "ALL" ? "Not finished yet" : "Series archive"}</h2></div><p className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-black text-zinc-300">{filteredRaces.length} shown</p></div>
        <section className="grid gap-6 lg:grid-cols-2">{filteredRaces.map((race, index) => <RaceCard key={race.id} race={race} index={index} faded={activeSeries !== "ALL" && isPast(race)} />)}</section>
        {filteredRaces.length === 0 && <div className="rounded-[2rem] border border-white/10 bg-black/40 p-10 text-center"><CalendarDays className="mx-auto mb-4 h-10 w-10 text-zinc-500" /><h2 className="text-2xl font-black uppercase">No races found</h2><p className="mt-2 text-zinc-400">Try another search or series filter.</p></div>}
        <footer className="mt-10 rounded-[2rem] border border-white/10 bg-black/40 p-5 text-sm leading-6 text-zinc-400">All automatically hides finished weekends from the main pile. Series tabs keep every 2026 weekend visible, with past races greyed out.</footer>
      </section>
    </main>
  );
}

function Stat({ value, label }) { return <div className="rounded-3xl border border-white/10 bg-black/35 p-4"><p className="text-3xl font-black">{value}</p><p className="text-sm text-zinc-400">{label}</p></div>; }
function Filter({ active, onClick, children }) { return <button onClick={onClick} className={`rounded-2xl px-4 py-3 text-sm font-black uppercase transition ${active ? "bg-white text-zinc-950" : "bg-black/40 text-zinc-300 hover:bg-white/10"}`}>{children}</button>; }
