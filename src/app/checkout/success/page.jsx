import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-md mx-auto my-20 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
      <h1 className="text-2xl font-black">Order saved</h1>
      
      <Link href="/profile" className="mt-6 inline-block bg-amber-500 text-zinc-950 font-bold px-6 py-2.5 rounded-xl text-sm">
        View in profile
      </Link>
    </div>
  );
}
