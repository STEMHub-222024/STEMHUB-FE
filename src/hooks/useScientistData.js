import { useEffect, useState } from 'react';
import * as scientistServices from '~/services/scientistServices';
function useScientistData() {
    const [scientists, setScientists] = useState([]);
    const [selectedScientist, setSelectedScientist] = useState(null);
    const [mainIndex, setMainIndex] = useState(2);

    useEffect(() => {
        let isMounted = true;
        const fetchApi = async () => {
            try {
                const response = await scientistServices.getScientist();
                if (isMounted) {
                    const lastFiveScientists = response.slice(-5);
                    setScientists(lastFiveScientists);
                    if (lastFiveScientists.length > 0) {
                        setSelectedScientist(lastFiveScientists[2]);
                    }
                }
            } catch (error) {}
        };

        fetchApi();

        return () => {
            isMounted = false;
        };
    }, []);

    return { scientists, setScientists, selectedScientist, setSelectedScientist, mainIndex, setMainIndex };
}

export default useScientistData;
