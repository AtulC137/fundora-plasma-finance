
import { Bitcoin, CircleDollarSign } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  twitter: string;
  avatar: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Alex Chen",
    role: "CEO & Co-Founder",
    twitter: "@alexchen",
    avatar: "/placeholder.svg",
  },
  {
    name: "Sophia Williams",
    role: "CTO",
    twitter: "@sophiatech",
    avatar: "/placeholder.svg",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Finance",
    twitter: "@marcusj",
    avatar: "/placeholder.svg",
  },
  {
    name: "Olivia Rodriguez",
    role: "Marketing Director",
    twitter: "@oliviar",
    avatar: "/placeholder.svg",
  },
  {
    name: "David Kim",
    role: "Blockchain Developer",
    twitter: "@davidkimdev",
    avatar: "/placeholder.svg",
  },
];

const AboutSection = () => {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-fundora-purple/5 to-transparent opacity-40"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-6 text-gradient">
            Meet the Founders
          </h2>
          <p className="max-w-2xl mx-auto text-fundora-silver opacity-80">
            Our team of financial experts and blockchain innovators are revolutionizing 
            how exporters access working capital through decentralized finance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="glass-morphism rounded-xl p-6 relative overflow-hidden group transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_10px_20px_rgba(0,123,255,0.15)]"
            >
              {/* Animated accent element */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-fundora-blue to-fundora-cyan rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
              <div className="relative z-10">
                {/* Avatar */}
                <div className="mb-4 relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-fundora-blue/20 to-fundora-cyan/20">
                      {index % 2 === 0 ? 
                        <Bitcoin className="w-10 h-10 text-fundora-cyan" /> : 
                        <CircleDollarSign className="w-10 h-10 text-fundora-blue" />
                      }
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full glow-border"></div>
                </div>
                
                {/* Details */}
                <h3 className="font-orbitron text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-fundora-silver text-sm mb-3">{member.role}</p>
                
                {/* Twitter handle */}
                <a 
                  href={`https://twitter.com/${member.twitter.substring(1)}`}
                  className="inline-flex items-center text-xs text-fundora-cyan hover:text-fundora-pink transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 mr-1 fill-current">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  {member.twitter}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
