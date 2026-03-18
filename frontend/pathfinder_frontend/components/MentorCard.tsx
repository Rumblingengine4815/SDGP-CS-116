import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { scaleIn } from '@/lib/animations';

export interface Mentor {
  id: string; name: string; title: string; avatar: string;
  skills: string[]; rating: number; sessions: number; isOnline: boolean;
}

export function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <motion.div variants={scaleIn}>
      <GlassCard hover className='p-6 flex flex-col gap-4'>
        {/* Avatar row */}
        <div className='flex items-start gap-4'>
          <div className='relative'>
            <Avatar className='w-14 h-14 ring-2 ring-pf-purple-200'>
              <AvatarImage src={mentor.avatar} alt={mentor.name} />
              <AvatarFallback className='bg-pf-purple-100 text-pf-purple-700 font-semibold'>
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {mentor.isOnline && (
              <span className='absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white' />
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-semibold text-gray-900 font-sora truncate'>{mentor.name}</p>
            <p className='text-sm text-gray-500 font-dm-sans truncate'>{mentor.title}</p>
            <div className='flex items-center gap-2 mt-1'>
              <span className='text-xs text-amber-500'>★ {mentor.rating.toFixed(1)}</span>
              <span className='text-xs text-gray-400'>·</span>
              <span className='text-xs text-gray-400'>{mentor.sessions} sessions</span>
            </div>
          </div>
        </div>
        {/* Skills */}
        <div className='flex flex-wrap gap-2'>
          {mentor.skills.slice(0,4).map((skill: string) => (
            <Badge key={skill} className='bg-pf-purple-100 text-pf-purple-700 border-0 text-xs px-2 py-1 rounded-full font-dm-sans'>
              {skill}
            </Badge>
          ))}
        </div>
        {/* CTA */}
        <Button variant='outline' size='sm' className='w-full border-pf-purple-300 text-pf-purple-600 hover:bg-pf-purple-50 font-dm-sans'>
          View Profile
        </Button>
      </GlassCard>
    </motion.div>
  );
}
