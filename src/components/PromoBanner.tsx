'use client'

import { motion } from 'framer-motion'
import { useMobileOptimizedAnimations } from '../hooks/useDeviceDetection'
import { siteConfig } from '../lib/siteConfig'
import Image from 'next/image'

export default function PromoBanner() {
  const { getAnimationConfig } = useMobileOptimizedAnimations()
  const animationConfig = getAnimationConfig()

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={animationConfig.initial}
          whileInView={{ opacity: 1, y: 0 }}
          transition={animationConfig.transition}
          viewport={animationConfig.viewport}
          className="relative overflow-hidden rounded-2xl motion-safe"
        >
          {/* Background Image */}
          <div className={`relative w-full aspect-[${siteConfig.banners.promo.aspectRatio}]`}>
            <Image
              src={siteConfig.banners.promo.image}
              alt={siteConfig.banners.promo.alt}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
