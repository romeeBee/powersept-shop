import { NextStudio } from 'sanity/next-studio'; // če bi uporabljali Next
// Za čisti React uvoziš orodje direktno:
import { Studio } from 'sanity';
import sanityConfig from '../sanity.config';

// Znotraj tvojih <Routes> dodaš:
<Route path="/studio/*" element={<Studio config={sanityConfig} />} />
