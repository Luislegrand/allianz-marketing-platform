// components/Logo.jsx
import Image from 'next/image'

export default function Logo({ size = 140, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="Allianz Marketing"
        width={size}
        height={size * 0.3}
        priority
      />
    </div>
  )
}
