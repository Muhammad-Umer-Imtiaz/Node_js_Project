import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { FaArrowLeft, FaArrowUp, FaArrowRight, FaFacebookF, FaWhatsapp, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { similarTools, featuredTools } from "@/constants";
import { getFeaturedProducts } from "@/constants";



export default async function ProductDetail(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params; // :white_check_mark: Awaiting `params` directly
  const products = await getFeaturedProducts();
  console.log(id);
  const product = products.find((item) => item.id === id);
  if (!product) return notFound();
  return (
    <div className="p-8 ml-10">
      {/* Back Link */}
      <Link href="/" className="flex gap-2 items-center text-[#000418] font-bold hover:underline">
        <FaArrowLeft size={15} /> <span>Browse all tools</span>
      </Link>

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-10">
        <div className="flex flex-col gap-6 mt-10">
          <h1 className="text-[#000000] text-5xl font-bold">{product.name}</h1>
          <Link 
            href={product.link || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white bg-[#7d42fb] border-2 border-black px-3 py-3 w-40 rounded-xl font-semibold hover:bg-black transition hover:-translate-y-1 text-center">
              Visit Website
          </Link>
          <div>
            <h3 className="text-[#000000] font-bold text-2xl">Overview</h3>
            <p className="text-[#000000] text-md font-semibold leading-8 w-130">
              {product.description}
            </p>
          </div>
          <p className="text-xl text-[#000000] font-bold">
            Category:
            <span className="bg-[#ecf2ff] ml-4 px-5 py-1 text-sm font-semibold rounded-full">
              {product.tag}
            </span>
          </p>
          <div className="flex items-center space-x-4">
            <p className="text-xl text-[#000000] font-bold">Share this on:</p>
            {/* Social Icons */}
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=YOUR_URL"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Facebook"
                className="bg-[#3b5998] text-white rounded-full p-2 hover:scale-110 transition-transform"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://api.whatsapp.com/send?text=YOUR_URL"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on WhatsApp"
                className="bg-[#25D366] text-white rounded-full p-2 hover:scale-110 transition-transform"
              >
                <FaWhatsapp size={16} />
              </a>
              <a
                href="https://www.linkedin.com/shareArticle?mini=true&url=YOUR_URL"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
                className="bg-[#0e76a8] text-white rounded-full p-2 hover:scale-110 transition-transform"
              >
                <FaLinkedinIn size={16} />
              </a>
              <a
                href="https://twitter.com/intent/tweet?url=YOUR_URL"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Twitter"
                className="bg-[#1DA1F2] text-white rounded-full p-2 hover:scale-110 transition-transform"
              >
                <FaTwitter size={16} />
              </a>
            </div>
          </div>
        </div>

        <Image
          src={product.image}
          alt={product.name}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto rounded-2xl"
        />
      </div>

      {/* Similar Tools and Sidebar */}
            <div className="flex flex-col md:flex-row px-4 md:px-6 py-10 gap-8 mt-10">
              {/* Similar Tools */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-6 text-black">Similar Tools</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {similarTools.map((tool, index) => (
                    <article
                      key={index}
                      className="w-full max-w-sm h-[500px] border rounded-3xl mx-auto transition-all duration-300 border-[#cbd7ea] shadow-[0_0_2px_0_#24417a14,0_2px_6px_0_#2900577d] hover:shadow-[0_0_2px_0_#24417a14,2px_2px_9px_0_#290058]"
                    >
                      <Image
                        src={tool.image}
                        alt={tool.name}
                        width={410}
                        height={240}
                        className="rounded-t-3xl"
                      />
                      <div className="flex justify-between px-4 mt-5">
                        <div className="flex items-center gap-2">
                          <Image
                            src={tool.logo}
                            alt={tool.name}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <h3 className="font-bold text-black">{tool.name}</h3>
                        </div>
                        <FiExternalLink size={28} className="text-[#7d42fb] mt-3" />
                      </div>
                      <p className="px-4 mt-5 text-[#46526a] font-semibold">
                        {tool.description}
                      </p>
                      <div className="flex gap-3 mt-5 px-4 items-center">
                        <span className="bg-[#ecf2ff] text-sm px-5 py-1 font-semibold rounded-full">
                          {tool.tag}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
      
              {/* Sidebar: Featured Tools */}
              <aside className="w-full md:w-[300px] mt-2 sticky top-8 self-start">
                <h2 className="text-4xl font-bold mb-4 text-black">Featured Tools</h2>
                <ul className="space-y-6">
                  {featuredTools.map((tool, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 py-5 border border-[#cecece] rounded-xl transition"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={tool.logo}
                          alt={tool.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <span className="font-medium text-black">{tool.name}</span>
                      </div>
                      <FiExternalLink size={24} className="text-[#7d42fb]" />
                    </li>
                  ))}
                </ul>
      
                {/* CTA: Submit Your Tool */}
                <div className="w-full mt-10 h-[400px] bg-[#ecf2ff] flex flex-col gap-8 px-6 py-8 rounded-xl">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#7d42fb] rounded-full text-white">
                    <FaArrowUp size={20} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[#030303] text-xl font-bold">Submit your Tool!</h3>
                    <p className="text-[#030303] text-md font-bold">
                      We continuously seek the newest and most innovative AI tools to
                      enhance our directory.
                    </p>
                  </div>
                  <Link href="/login">
                    <button className="w-[60%] flex gap-2 items-center px-5 py-2 rounded-full bg-black text-white transition hover:-translate-y-1">
                      Submit now <FaArrowRight />
                    </button>
                  </Link>
                </div>
              </aside>
            </div>
    </div>
  );
}
