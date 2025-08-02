import InfiniteGrid from '../components/InfiniteGrid';

const Index = () => {
    const sources = [
        { src: 'img1.jpg', caption: 'Fire Force Collection <br>Manga volumes & Anime figure <br>Multiple editions and releases <br>2021' },
        { src: 'img2.jpg', caption: 'Mogok Village, Myanmar <br>Scenic Landscape View <br>Captured in Natural Light <br>2025' },
        { src: 'img3.jpg', caption: 'Anime Ema at Kanda Myojin Shrine <br>Traditional wooden prayer plaque <br>Featuring characters from Love Live! <br>2025' },
        { src: 'img4.jpg', caption: 'White Chrysanthemums <br>Digital Photograph <br>Edition of 1 Plus an additional artist Proof <br>2022' },
        { src: 'img5.jpg', caption: 'Shibuya Street Scene <br>Digital Photograph <br>Edition of 1 Plus an additional artist Proof <br>2016' },
        { src: 'img6.jpg', caption: 'Anime Prints <br>Various sizes, digital prints <br>Personal Collection <br>2025' },
        { src: 'img7.jpg', caption: 'ComicSense Pin <br>Illustrated Pin <br>Edition of 1 (or more, as a product) <br>2025' },
        { src: 'img8.jpg', caption: 'My Neighbor Totoro Figurine <br>Display piece for fans <br>Edition of 1 (unique personal item) <br>2022' },
        { src: 'img9.jpg', caption: 'Amusement Park Swings <br>Digital Photograph <br>Edition of 1 Plus an additional artist Proof <br>2025' },
    ];

    const data = [
        { x: 71, y: 58, w: 400, h: 270 },
        { x: 211, y: 255, w: 540, h: 360 },
        { x: 631, y: 158, w: 400, h: 270 },
        { x: 1191, y: 245, w: 260, h: 195 },
        { x: 351, y: 687, w: 260, h: 290 },
        { x: 751, y: 824, w: 205, h: 154 },
        { x: 911, y: 540, w: 260, h: 350 },
        { x: 1051, y: 803, w: 400, h: 300 },
        { x: 71, y: 922, w: 350, h: 260 },

    ];

    return (
        <section id="hero" className="w-full h-screen box-border overflow-hidden select-none cursor-grab touch-none">
            <InfiniteGrid
                sources={sources}
                data={data}
                originalSize={{ w: 1522, h: 1238 }}
            />
        </section>
    );
};

export default Index;
