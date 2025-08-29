import Home from './Home';

const fetchAstrologerBannerHomeData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-banner-home`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch astrologer data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching astrologer data:', error);
    return null;
  }
};

const fetchTopSellingSlider = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-product-list-top-selling/top_selling`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch astrologer data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching astrologer data:', error);
    return null;
  }
};

const fetchNewlyLaunchedSlider = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-astro-product-list-newly-launched/newlyLaunched`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch astrologer data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching astrologer data:', error);
    return null;
  }
};

const fetchNewlySeminarList = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/get-seminar-list-data`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch astrologer data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching astrologer data:', error);
    return null;
  }
};
export default async function HomePage() {
  const homeBannerData = await fetchAstrologerBannerHomeData(); 
  const topSellingSlider = await fetchTopSellingSlider(); 
  const NewlyLaunchedSlider = await fetchNewlyLaunchedSlider(); 
  const NewlySeminarList = await fetchNewlySeminarList(); 


  return <Home  homeBannerData={homeBannerData} topSellingSlider={topSellingSlider?.data} NewlyLaunchedSlider={NewlyLaunchedSlider?.data} NewlySeminarList={NewlySeminarList?.data[0]}/>; 
}
