import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

interface Source {
    src: string;
    caption: string;
}

interface Data {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface InfiniteGridProps {
    sources: Source[];
    data: Data[];
    originalSize: { w: number; h: number };
}

interface Item {
    el: HTMLDivElement;
    img: HTMLImageElement;
    x: number;
    y: number;
    w: number;
    h: number;
    extraX: number;
    extraY: number;
    rect: DOMRect;
    ease: number;
}

const InfiniteGrid: React.FC<InfiniteGridProps> = ({ sources, data, originalSize }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [popup, setPopup] = useState<{ src: string; caption: string } | null>(null);
    const popupImageRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (popup && popupImageRef.current && overlayRef.current) {
            gsap.fromTo(
                overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
            gsap.fromTo(
                popupImageRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
            );
        }
    }, [popup]);

    useEffect(() => {
        const el = containerRef.current!;
        const initialize = () => {
            const winW = window.innerWidth;
            const winH = window.innerHeight;

            const tileSize = {
                w: winW,
                h: winW * (originalSize.h / originalSize.w),
            };

            const scroll = {
                ease: 0.06,
                current: { x: -winW * 0.1, y: -winH * 0.1 },
                target: { x: -winW * 0.1, y: -winH * 0.1 },
                last: { x: -winW * 0.1, y: -winH * 0.1 },
                delta: { x: { c: 0, t: 0 }, y: { c: 0, t: 0 } },
            };

            const mouse = {
                x: { t: 0.5, c: 0.5 },
                y: { t: 0.5, c: 0.5 },
                press: { t: 0, c: 0 },
            };

            let isDragging = false;
            const drag = { startX: 0, startY: 0, scrollX: 0, scrollY: 0 };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle('visible', entry.isIntersecting);
                });
            });

            const scaleX = tileSize.w / originalSize.w;
            const scaleY = tileSize.h / originalSize.h;

            const baseItems = data.map((d, i) => ({
                ...d,
                src: sources[i % sources.length].src,
                caption: sources[i % sources.length].caption,
                x: d.x * scaleX,
                y: d.y * scaleY,
                w: d.w * scaleX,
                h: d.h * scaleY,
            }));

            const repsX = [0, tileSize.w];
            const repsY = [0, tileSize.h];
            const items: Item[] = [];

            el.innerHTML = '';

            baseItems.forEach((base) => {
                repsX.forEach((offsetX) => {
                    repsY.forEach((offsetY) => {
                        const itemEl = document.createElement('div');
                        itemEl.className = 'item absolute top-0 left-0';
                        itemEl.style.width = `${base.w}px`;

                        const wrapper = document.createElement('div');
                        wrapper.className = 'item-wrapper will-change-transform';

                        const itemImage = document.createElement('div');
                        itemImage.className = 'item-image overflow-hidden';
                        itemImage.style.width = `${base.w}px`;
                        itemImage.style.height = `${base.h}px`;

                        const img = new Image();
                        img.src = `/img/${base.src}`;
                        img.className = 'w-full h-full object-cover will-change-transform custom-shadow opacity-0 scale-95';
                        img.addEventListener('click', () => {
                            setPopup({ src: base.src, caption: base.caption });
                        });

                        itemImage.appendChild(img);
                        wrapper.appendChild(itemImage);

                        const caption = document.createElement('small');
                        caption.className = 'block text-[8rem] mt-[12rem] leading-[1.25]';
                        caption.innerHTML = base.caption;
                        wrapper.appendChild(caption);

                        itemEl.appendChild(wrapper);
                        el.appendChild(itemEl);

                        const split = new SplitText(caption, { type: 'lines', linesClass: 'line' });
                        gsap.set(split.lines, { opacity: 0, y: 2 });
                        gsap.to(split.lines, {
                            opacity: 1,
                            y: 0,
                            duration: 0.4,
                            ease: 'power2.out',
                            stagger: 0.1,
                            delay: 0.1,
                        });

                        gsap.to(img, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.6,
                            ease: 'power2.out',
                            delay: 0.1 + Math.random() * 0.3,
                        });

                        observer.observe(caption);

                        items.push({
                            el: itemEl,
                            img,
                            x: base.x + offsetX,
                            y: base.y + offsetY,
                            w: base.w,
                            h: base.h,
                            extraX: 0,
                            extraY: 0,
                            rect: itemEl.getBoundingClientRect(),
                            ease: Math.random() * 0.5 + 0.5,
                        });
                    });
                });
            });

            tileSize.w *= 2;
            tileSize.h *= 2;

            const onWheel = (e: WheelEvent) => {
                e.preventDefault();
                const factor = 0.4;
                scroll.target.x -= e.deltaX * factor;
                scroll.target.y -= e.deltaY * factor;
            };

            const onMouseMove = (e: MouseEvent) => {
                mouse.x.t = e.clientX / winW;
                mouse.y.t = e.clientY / winH;
                if (isDragging) {
                    const dx = e.clientX - drag.startX;
                    const dy = e.clientY - drag.startY;
                    scroll.target.x = drag.scrollX + dx;
                    scroll.target.y = drag.scrollY + dy;
                }
            };

            const onMouseDown = (e: MouseEvent) => {
                e.preventDefault();
                isDragging = true;
                document.documentElement.classList.add('dragging');
                drag.startX = e.clientX;
                drag.startY = e.clientY;
                drag.scrollX = scroll.target.x;
                drag.scrollY = scroll.target.y;
                mouse.press.t = 1;
            };

            const onMouseUp = () => {
                isDragging = false;
                document.documentElement.classList.remove('dragging');
                mouse.press.t = 0;
            };

            const onTouchStart = (e: TouchEvent) => {
                if (e.touches.length !== 1) return;
                isDragging = true;
                document.documentElement.classList.add('dragging');
                drag.startX = e.touches[0].clientX;
                drag.startY = e.touches[0].clientY;
                drag.scrollX = scroll.target.x;
                drag.scrollY = scroll.target.y;
                mouse.press.t = 1;
            };

            const onTouchMove = (e: TouchEvent) => {
                if (!isDragging || e.touches.length !== 1) return;
                const dx = e.touches[0].clientX - drag.startX;
                const dy = e.touches[0].clientY - drag.startY;
                scroll.target.x = drag.scrollX + dx;
                scroll.target.y = drag.scrollY + dy;
            };

            const onTouchEnd = () => {
                isDragging = false;
                document.documentElement.classList.remove('dragging');
                mouse.press.t = 0;
            };

            const render = () => {
                scroll.current.x += (scroll.target.x - scroll.current.x) * scroll.ease;
                scroll.current.y += (scroll.target.y - scroll.current.y) * scroll.ease;

                scroll.delta.x.t = scroll.current.x - scroll.last.x;
                scroll.delta.y.t = scroll.current.y - scroll.last.y;
                scroll.delta.x.c += (scroll.delta.x.t - scroll.delta.x.c) * 0.04;
                scroll.delta.y.c += (scroll.delta.y.t - scroll.delta.y.c) * 0.04;
                mouse.x.c += (mouse.x.t - mouse.x.c) * 0.04;
                mouse.y.c += (mouse.y.t - mouse.y.c) * 0.04;
                mouse.press.c += (mouse.press.t - mouse.press.c) * 0.04;

                const dirX = scroll.current.x > scroll.last.x ? 'right' : 'left';
                const dirY = scroll.current.y > scroll.last.y ? 'down' : 'up';

                items.forEach((item) => {
                    const newX = 5 * scroll.delta.x.c * item.ease + (mouse.x.c - 0.5) * item.rect.width * 0.6;
                    const newY = 5 * scroll.delta.y.c * item.ease + (mouse.y.c - 0.5) * item.rect.height * 0.6;

                    const posX = item.x + scroll.current.x + item.extraX + newX;
                    const posY = item.y + scroll.current.y + item.extraY + newY;

                    if (dirX === 'right' && posX > winW) item.extraX -= tileSize.w;
                    if (dirX === 'left' && posX + item.rect.width < 0) item.extraX += tileSize.w;
                    if (dirY === 'down' && posY > winH) item.extraY -= tileSize.h;
                    if (dirY === 'up' && posY + item.rect.height < 0) item.extraY += tileSize.h;

                    const fx = item.x + scroll.current.x + item.extraX + newX;
                    const fy = item.y + scroll.current.y + item.extraY + newY;

                    item.el.style.transform = `translate(${fx}px, ${fy}px)`;
                    item.img.style.transform = `scale(${1.2 + 0.2 * mouse.press.c * item.ease}) translate(${-mouse.x.c * item.ease * 10}%, ${-mouse.y.c * item.ease * 10}%)`;
                });

                scroll.last.x = scroll.current.x;
                scroll.last.y = scroll.current.y;
                requestAnimationFrame(render);
            };

            window.addEventListener('wheel', onWheel, { passive: false });
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mousedown', onMouseDown);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchstart', onTouchStart, { passive: false });
            window.addEventListener('touchmove', onTouchMove, { passive: false });
            window.addEventListener('touchend', onTouchEnd);

            render();

            return () => {
                window.removeEventListener('wheel', onWheel);
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mousedown', onMouseDown);
                window.removeEventListener('mouseup', onMouseUp);
                window.removeEventListener('touchstart', onTouchStart);
                window.removeEventListener('touchmove', onTouchMove);
                window.removeEventListener('touchend', onTouchEnd);
                observer.disconnect();
            };
        };

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(initialize);
        } else {
            setTimeout(initialize, 500);
        }
    }, [sources, data, originalSize]);

    return (
        <>
            <div
                id="images"
                ref={containerRef}
                className="w-full h-full inline-block whitespace-nowrap relative"
            />
            {popup && (
                <div
                    ref={overlayRef}
                    onClick={() => setPopup(null)}
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center cursor-pointer"
                >
                    <div className="max-w-[90vw] max-h-[90vh] text-center" onClick={(e) => e.stopPropagation()}>
                        <img
                            ref={popupImageRef}
                            src={`/img/${popup.src}`}
                            alt="popup"
                            className="max-h-[70vh] mx-auto mb-4 rounded-xl shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default InfiniteGrid;
