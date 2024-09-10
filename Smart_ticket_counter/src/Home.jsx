import { useNavigate } from "react-router-dom"
const Home=()=>
{
    
    const nav=useNavigate();
    const handlehm=()=>
    {
        nav('/counter');
    }

    const handlecon=()=>
    {

        nav('/dashboard')

    }
    return(
        <>

        <div>
            <h1>Smart Transit</h1>
        </div>

        <div className="buttonshome">
            <div className="dashbut" onClick={handlehm}>
                <h3>Ticket Counter</h3>   
            </div>

            <div className="dashbut" onClick={handlecon}>
                <h3>Overall Dashboard</h3>
            </div>
        </div>
        </>
    )
}

export default Home