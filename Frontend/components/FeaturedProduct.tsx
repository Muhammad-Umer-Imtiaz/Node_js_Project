"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { featuredProducts } from "@/constants";

const FeaturedProduct: React.FC = () => {
  return (
    <main className="px-4 md:px-16">
      <h1 className="font-bold text-4xl mb-10 px-4 text-black">
        Featured Tools
      </h1>
      <section className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 ">
        {featuredProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <article className="w-full max-w-sm h-[500px] border rounded-3xl mx-auto transition-all"
              style={{
                borderColor: '#cbd7ea',
                boxShadow: '0 0 2px 0 #24417a14, 0 2px 6px 0 #2900577d',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 2px 0 #24417a14, 2px 2px 9px 0 #290058';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 2px 0 #24417a14, 0 2px 6px 0 #2900577d';
              }}
            >
              {/* <div className="absolute inset-0 -z-10 rounded-3xl bg-[#b499ff] blur-2xl opacity-40"></div> */}
              <Image
                src={product.image}
                alt="Featured product: OpusClip"
                width={410}
                height={240}
                className="rounded-t-3xl"
              />
              <div className="flex justify-between px-4 mt-5">
                <div className="flex items-center gap-2">
                  <Image
                    src={product.logo}
                    alt="Opus logo"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <h3 className="font-bold" style={{color: 'black'}}>{product.name}</h3>
                </div>
                <span className="text-[#7d42fb] mt-3">
                  <FiExternalLink size={28} />
                </span>
              </div>
              <p className="px-4 mt-5 text-[#46526a] font-semibold">
                {product.description}
              </p>
              <div className="flex gap-3 mt-5 px-4 items-center">
                <Image
                  src={product.tagIcon}
                  alt="Star rating icon"
                  width={30}
                  height={30}
                />
                <span className="bg-[#ecf2ff] px-5 py-1 rounded-full">
                  {product.tag}
                </span>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default FeaturedProduct;
