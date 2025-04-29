
import { useEffect, useRef } from "react";

const FloatingElements = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const elements = container.querySelectorAll('.floating-element');
    
    const animateElements = () => {
      elements.forEach((element) => {
        const speedX = parseFloat(element.getAttribute('data-speed-x') || '1');
        const speedY = parseFloat(element.getAttribute('data-speed-y') || '1');
        
        const posX = (Math.sin(Date.now() * 0.001 * speedX) * 15) + 'px';
        const posY = (Math.sin(Date.now() * 0.002 * speedY) * 15) + 'px';
        
        (element as HTMLElement).style.transform = `translate(${posX}, ${posY})`;
      });
      
      requestAnimationFrame(animateElements);
    };
    
    const animationId = requestAnimationFrame(animateElements);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating coin elements */}
      <div 
        className="floating-element absolute top-[15%] left-[10%] w-10 h-10 rounded-full bg-fundora-blue/20 blur-md"
        data-speed-x="1" 
        data-speed-y="1.2"
      ></div>
      <div 
        className="floating-element absolute top-[60%] left-[80%] w-20 h-20 rounded-full bg-fundora-cyan/20 blur-md"
        data-speed-x="0.7" 
        data-speed-y="1"
      ></div>
      <div 
        className="floating-element absolute top-[30%] left-[70%] w-8 h-8 rounded-full bg-fundora-pink/20 blur-md"
        data-speed-x="0.9" 
        data-speed-y="0.8"
      ></div>
      <div 
        className="floating-element absolute top-[80%] left-[30%] w-12 h-12 rounded-full bg-fundora-purple/20 blur-md"
        data-speed-x="1.1" 
        data-speed-y="0.9"
      ></div>
      
      {/* Light streaks */}
      <div className="absolute top-0 left-1/4 w-[1px] h-[30vh] bg-gradient-to-b from-transparent via-fundora-blue/20 to-transparent"></div>
      <div className="absolute top-[40%] right-1/5 w-[1px] h-[40vh] bg-gradient-to-b from-transparent via-fundora-cyan/20 to-transparent"></div>
      
      {/* Glowing orbs */}
      <div className="absolute -top-[10%] left-[50%] w-[500px] h-[500px] rounded-full bg-gradient-radial from-fundora-blue/5 to-transparent blur-3xl"></div>
      <div className="absolute top-[60%] left-[20%] w-[300px] h-[300px] rounded-full bg-gradient-radial from-fundora-purple/5 to-transparent blur-3xl"></div>
    </div>
  );
};

export default FloatingElements;
