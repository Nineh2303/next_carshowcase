"use client" ;

import {Hero, SearchBar, CustomFilter, CarCard, ShowMore} from "@/components";
import {fetchData} from "@/utils";
import {fuels, manufacturers, yearsOfProduction} from "@/constants";
import {useEffect, useState} from "react";
import Image from "next/image";

export default  function Home() {
    const [allCars, setAllCars] = useState([]);
    const [loading, setIsLoading] = useState(false);
    //search state
    const [manufacturer, setManufacturer] = useState("");
    const [model, setModel] = useState("");

    //filter state
    const [fuel, setFuel] = useState("");
    const [year, setYear] = useState(2020);
    // pagination state
    const [limit, setLimit] = useState(10);

    const getCars= async ()=>{
        setIsLoading(true)
        try {
            const result =  await fetchData({
                manufacturer: manufacturer ||"",
                year : year || 2020,
                fuel: fuel ||'',
                limit : limit || 10,
                model :model || ''
            })
            setAllCars(result)
        } catch (err){
            console.log(err)
        }finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        getCars();
    },[fuel, year,limit,manufacturer,model])



    const isDataEmpty = !Array.isArray(allCars) || allCars.length <1 || !allCars
    return (
        <main className="overflow-hidden">
            <Hero/>
            <div className="mt-12 padding-x padding-y max-width" id="discover">
                <div className="home__text-container">
                    <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
                    <p>Explore the cars you might like</p>
                </div>
                <div className="home__filters">
                    <SearchBar
                        setManufacturer={setManufacturer}
                        setModel ={setModel}
                    />
                    <div className="home__filter-container">
                        <CustomFilter title="fuel"
                                      options={fuels}
                                      // setFilter={setFuel()}
                        />
                        <CustomFilter title="year"
                                      options ={yearsOfProduction}
                                      // setFilter={setYear()}
                        />
                    </div>
                </div>
                {
                    allCars.length> 0 ?(
                        <section>
                            <div className="home__cars-wrapper">
                                {allCars?.map((car)=>
                                    (<CarCard car={car}  key={car.key}/>))}
                            </div>
                            {
                                loading && (
                                    <div className="mt-16 w-full flex-center">
                                        <Image
                                            src="/loader.svg"
                                            alt="loader"
                                            width={50}
                                            height={50}
                                            className="object-contain"
                                        ></Image>
                                    </div>
                                )
                            }
                            <ShowMore
                                pageNumber ={(limit || 10)/10}
                                isNext ={(limit||10) > allCars.length }
                            />
                        </section>

                    ) : (
                        <div className="home__error-container">
                            <h2 className="text-black text-xl font-bold">Oops, no result</h2>
                            {/*<p>{allCars?.message}</p>*/}
                        </div>

                    )
                }
            </div>
        </main>
    )
}
