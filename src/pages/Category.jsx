import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection,
     getDocs, 
     query, 
     where, 
     orderBy, 
     limit, 
     startAfter 
    } from 'firebase/firestore'
    import { db } from '../firebase.config'
    import { toast } from 'react-toastify'
    import Spinner from "../components/Spinner"

function Category() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
//  use-params for detecting page's locations
    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // getting a reference
                const listingsRef = collection(db, 'listings')

                // creating a query
                const q = query(
                    listingsRef, 
                    where('type', '==', params.categoryName), orderBy('timestamp', 'desc'), 
                    limit(10)
                    )

                // Executing query
                const querySnap = await getDocs(q)

                const listings = []

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                // puuting the fetched listing into the listing state
                setListings(listings)
                setLoading(false)

            } catch (error) {
                console.log(error)
                toast.error('Could not fetch listings')
                
            }
        }
        fetchListings()
    }, [params.categoryName])

  return (
    <div className="category">
        <header>
            <p className="pageHeader">
                {params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}
            </p>
        </header>
        
        {loading ?
         <Spinner />
        : listings && listings.length
         > 0 ? 
         <>
         <main>
            <ul className="categoryListings">
                {listings.map((listing) => (
                    <h3>{listing.data.name}</h3>
                ))}
            </ul>
         </main>
         </> : 
         <p>No Listings For {params.categoryName} </p>}
    </div>
  )
}

export default Category