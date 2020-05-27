import { FishType } from '../data';

export const Fishes: { [K in FishType]: string } = {
    'Blue Cod': require('./bluecod.png'),
    'Flat Fish': require('./flatfish.png'),
    'John Dory': require('./johndory.png'),
    'Kingfish': require('./kingfish.png'),
    'Orange Roughy': require('./orange_roughy.png'),
    'Snapper': require('./snapper.png'),
    'Tarakihi': require('./tarakihi.png'),
    'Trevally': require('./trevalley.png')
}