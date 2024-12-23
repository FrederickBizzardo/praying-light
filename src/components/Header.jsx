//import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';

import '../assets/fonts.css';

export default function Header() {
    return(
        <>
            <motion.h1 initial={{ y: -100 }} animate={{ y: 0}} className="absolute top-10 left-5 font-OnestB text-4xl text-white">Shining Lights</motion.h1>
        </>
    );
}