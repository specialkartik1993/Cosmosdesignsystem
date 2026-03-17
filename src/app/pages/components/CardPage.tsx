import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ComponentPage, Showcase } from './ComponentPage';
import {
  Heart, MessageSquare, Share2, MoreHorizontal, ArrowUpRight, Sparkles, Star,
  Clock, Users, Zap, TrendingUp, TrendingDown, Check, Shield, Rocket, Eye,
  Download, Activity, BarChart3, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export function CardPage() {
  const [liked, setLiked] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <ComponentPage title="Card" description="Cards are versatile containers for grouping related content and actions. They create visual hierarchy and organize information.">
      <Showcase title="Basic Cards" delay={0.05} code={`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@cosmos-ds/react';

<Card>
  <CardHeader>
    <CardTitle>Simple Card</CardTitle>
    <CardDescription>A basic card with header and content.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>`}>
        <div className="grid sm:grid-cols-3 gap-4">
          <Card><CardHeader><CardTitle>Simple Card</CardTitle><CardDescription>A basic card with header and content.</CardDescription></CardHeader><CardContent><p>Card content goes here.</p></CardContent></Card>
          <Card><CardHeader><CardTitle>With Footer</CardTitle><CardDescription>Cards can have action footers.</CardDescription></CardHeader><CardContent><p>Content section with additional actions below.</p></CardContent><CardFooter className="flex gap-2"><Button size="sm">Save</Button><Button size="sm" variant="ghost">Cancel</Button></CardFooter></Card>
          <Card className="border-primary/30 bg-primary/5"><CardHeader><Badge className="w-fit mb-1">Featured</Badge><CardTitle>Highlighted Card</CardTitle><CardDescription>With accent border and background.</CardDescription></CardHeader></Card>
        </div>
      </Showcase>

      <Showcase title="Interactive Cards" description="Cards with hover effects, motion, and interactive state." delay={0.08} code={`<motion.div whileHover={{ y: -4 }}>
  <Card className="cursor-pointer group hover:shadow-lg">
    <div className="h-24 bg-gradient-to-br from-indigo-500 to-purple-500" />
    <CardHeader>
      <CardTitle>Design System <ArrowUpRight /></CardTitle>
    </CardHeader>
  </Card>
</motion.div>`}>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { title: 'Design System', desc: 'Build consistent UI', icon: Sparkles, color: 'from-indigo-500 to-purple-500' },
            { title: 'Performance', desc: 'Optimize for speed', icon: Zap, color: 'from-amber-500 to-orange-500' },
            { title: 'Collaboration', desc: 'Work together', icon: Users, color: 'from-emerald-500 to-teal-500' },
          ].map(card => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Card className="cursor-pointer group hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 overflow-hidden">
                  <div className={`h-24 bg-gradient-to-br ${card.color} flex items-center justify-center relative overflow-hidden`}>
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <Icon className="w-8 h-8 text-white relative z-10" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {card.title}
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </CardTitle>
                    <CardDescription>{card.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Showcase>

      <Showcase title="Social Card" description="Rich social media style card with reactions." delay={0.11} code={`<Card className="max-w-md">
  <CardHeader>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-indigo-500 text-white">SC</div>
      <div>
        <CardTitle>Sarah Chen</CardTitle>
        <CardDescription>2 hours ago</CardDescription>
      </div>
    </div>
  </CardHeader>
  ...
</Card>`}>
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white" style={{ fontWeight: 600 }}>SC</div>
                <div>
                  <CardTitle className="text-[14px]">Sarah Chen</CardTitle>
                  <CardDescription className="text-[12px]">2 hours ago</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px]"><Shield className="w-2.5 h-2.5 mr-1" />Verified</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[14px] leading-relaxed">Just shipped the new Cosmos Design System! It's been months of work but the result is beautiful. Can't wait to see what everyone builds with it.</p>
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className="text-[10px]">#designsystems</Badge>
              <Badge variant="outline" className="text-[10px]">#react</Badge>
              <Badge variant="outline" className="text-[10px]">#oss</Badge>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border pt-3 flex gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-1.5 text-[13px] transition-colors cursor-pointer ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setLiked(!liked)}
            >
              <motion.div animate={liked ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.span key={liked ? '25' : '24'} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 6, opacity: 0 }} transition={{ duration: 0.12 }}>
                  {liked ? '25' : '24'}
                </motion.span>
              </AnimatePresence>
            </motion.button>
            <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><MessageSquare className="w-4 h-4" /> 8</button>
            <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><Share2 className="w-4 h-4" /> Share</button>
            <button className="ml-auto text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><MoreHorizontal className="w-4 h-4" /></button>
          </CardFooter>
        </Card>
      </Showcase>

      <Showcase title="Stats Dashboard Cards" description="KPI cards with trends, sparklines, and animated values." delay={0.14} code={`<Card>
  <CardContent className="pt-5">
    <p className="text-[12px] text-muted-foreground">Total Revenue</p>
    <p className="text-[1.5rem] font-bold">$45,231</p>
    <p className="text-[12px] text-emerald-500">+20.1% from last month</p>
  </CardContent>
</Card>`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: '$45,231', change: '+20.1%', up: true, icon: BarChart3, color: 'text-blue-500 bg-blue-500/10' },
            { label: 'Subscribers', value: '2,350', change: '+180', up: true, icon: Users, color: 'text-purple-500 bg-purple-500/10' },
            { label: 'Active Users', value: '12.5K', change: '-3.2%', up: false, icon: Activity, color: 'text-amber-500 bg-amber-500/10' },
            { label: 'Bounce Rate', value: '24.5%', change: '-2.1%', up: true, icon: Globe, color: 'text-emerald-500 bg-emerald-500/10' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -3 }}>
                <Card className="hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[12px] text-muted-foreground" style={{ fontWeight: 500 }}>{stat.label}</p>
                      <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-[1.5rem]" style={{ fontWeight: 700 }}>{stat.value}</p>
                    <p className={`text-[12px] mt-1 flex items-center gap-1 ${stat.up ? 'text-emerald-500' : 'text-red-500'}`} style={{ fontWeight: 500 }}>
                      {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Showcase>

      <Showcase title="Pricing Cards" description="Pricing tiers with hover highlighting." delay={0.17} code={`<Card className="border-primary shadow-lg relative">
  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
    <Badge>Most Popular</Badge>
  </div>
  ...
</Card>`}>
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
          {[
            { name: 'Starter', price: '$0', features: ['5 projects', '1GB storage', 'Email support', 'Basic analytics'] },
            { name: 'Pro', price: '$29', features: ['Unlimited projects', '100GB storage', 'Priority support', 'Custom domains', 'Advanced analytics', 'Team collaboration'], popular: true },
            { name: 'Enterprise', price: '$99', features: ['Everything in Pro', '1TB storage', 'Dedicated support', 'SLA guarantee', 'SSO & SAML', 'Custom contracts'] },
          ].map(plan => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -4 }}
              onHoverStart={() => setHoveredPlan(plan.name)}
              onHoverEnd={() => setHoveredPlan(null)}
            >
              <Card className={`relative overflow-hidden transition-all duration-300 h-full ${plan.popular ? 'border-primary shadow-lg shadow-primary/10' : hoveredPlan === plan.name ? 'border-primary/40 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"><Badge>Most Popular</Badge></div>
                )}
                {plan.popular && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />}
                <CardHeader className="text-center pt-6">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="py-2">
                    <span className="text-[2rem]" style={{ fontWeight: 800 }}>{plan.price}</span>
                    <span className="text-muted-foreground text-[14px]">/mo</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-[13px]">
                        <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>Get Started</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </Showcase>

      <Showcase title="Feature Cards" description="Icon-driven feature cards with gradient accents." delay={0.2} code={`<Card className="group hover:border-primary/20 hover:shadow-xl">
  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400" />
  <h3>Feature Title</h3>
  <p>Feature description...</p>
</Card>`}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Rocket, title: 'Fast Setup', desc: 'Get started in under 5 minutes with our CLI tooling.', gradient: 'from-blue-500 to-cyan-400' },
            { icon: Shield, title: 'Enterprise Security', desc: 'SOC 2 Type II certified with end-to-end encryption.', gradient: 'from-emerald-500 to-teal-400' },
            { icon: Eye, title: 'Accessibility First', desc: 'Every component passes WCAG 2.1 AA standards.', gradient: 'from-purple-500 to-pink-400' },
            { icon: Download, title: 'Tree-Shakeable', desc: 'Only bundle the components you actually use.', gradient: 'from-amber-500 to-orange-400' },
            { icon: Globe, title: 'i18n Ready', desc: 'Full RTL support and locale-aware formatting.', gradient: 'from-indigo-500 to-blue-400' },
            { icon: Activity, title: 'Real-time Updates', desc: 'Live collaboration with instant sync across devices.', gradient: 'from-rose-500 to-red-400' },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} whileHover={{ y: -4 }}>
                <Card className="group hover:border-primary/20 hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="pt-6">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-[15px] mb-1.5" style={{ fontWeight: 600 }}>{feature.title}</h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Showcase>

      <Showcase title="User Profile Card" description="Rich profile card with avatar, stats, and actions." delay={0.23} code={`<Card className="max-w-sm text-center">
  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-500 mx-auto" />
  <CardTitle>Sarah Chen</CardTitle>
  <div className="grid grid-cols-3 gap-4">
    <div><span className="font-bold">142</span><span>Posts</span></div>
    ...
  </div>
</Card>`}>
        <div className="max-w-sm mx-auto">
          <Card className="overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-primary via-purple-500 to-pink-500 relative" />
            <div className="px-6 pb-6 -mt-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-[18px] border-4 border-card mx-auto" style={{ fontWeight: 700 }}>SC</div>
              <h3 className="text-[16px] mt-3" style={{ fontWeight: 700 }}>Sarah Chen</h3>
              <p className="text-[12px] text-muted-foreground">Principal Product Designer</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <Badge variant="secondary" className="text-[10px]">Design</Badge>
                <Badge variant="secondary" className="text-[10px]">Strategy</Badge>
                <Badge variant="secondary" className="text-[10px]">A11y</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                {[
                  { label: 'Projects', value: '142' },
                  { label: 'Followers', value: '8.2K' },
                  { label: 'Rating', value: '4.9' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-[15px]" style={{ fontWeight: 700 }}>{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" size="sm">Follow</Button>
                <Button variant="outline" size="sm" className="flex-1">Message</Button>
              </div>
            </div>
          </Card>
        </div>
      </Showcase>
    </ComponentPage>
  );
}
