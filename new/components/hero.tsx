
export default function Hero() {
    // <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] w-full bg-no-repeat bg-cover bg-center text-sm pb-44">
    return (
        <section className=" w-full text-sm pb-44">
            <div className="flex items-center gap-2 border border-slate-300 hover:border-slate-400/70 rounded-full w-max mx-auto px-4 py-2 mt-40 md:mt-32">
                <button className="flex items-center gap-1 font-medium">
                    <span>Read more</span>
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="fg-foreground">
                        <path d="M3.959 9.5h11.083m0 0L9.501 3.958M15.042 9.5l-5.541 5.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            <h5 className="text-4xl md:text-7xl font-medium max-w-[850px] text-center mx-auto mt-8">
                Experience beer like never before
            </h5>

            <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-6 max-md:px-2">With trichter you can forever remember your greatest moments, how much you drank and how you looked.</p>

            <div className="mx-auto w-full flex items-center justify-center gap-3 mt-4">
                <button className="bg-primary hover:bg-black text-primary-foreground px-6 py-3 rounded-full font-medium transition">
                    Get Started
                </button>
                <button className="flex items-center gap-2 border border-slate-300 hover:bg-slate-200/30 rounded-full px-6 py-3">
                    <span>Learn More</span>
                    <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="fg-foreground">
                        <path d="M1.25.5 4.75 4l-3.5 3.5" stroke="currentColor" strokeOpacity=".4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </section>
    )
}
// <script>
//     const menu = document.getElementById('menu');
//     const closeMenu = document.getElementById('close-menu');
//     const openMenu = document.getElementById('open-menu');
//
//     closeMenu.addEventListener('click', () => {
//         menu.classNameList.remove('max-md:w-full');
//         menu.classNameList.add('max-md:w-0');
//     });
//
//     openMenu.addEventListener('click', () => {
//         menu.classNameList.remove('max-md:w-0');
//         menu.classNameList.add('max-md:w-full');
//     });
// </script>
