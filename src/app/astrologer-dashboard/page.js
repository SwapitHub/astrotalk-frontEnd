import AstrologerHome from "./AstrologerHome";
export const dynamic = 'force-dynamic';

const AstrologerDashboardServer = async({searchParams, params})=>{
  // const {user, astrologer} = searchParams;


  
return(
  <>
  {/* <AstrologerDashboard/> */}
  <AstrologerHome/>
  </>
)
}
export default AstrologerDashboardServer;