import { useUnit } from "effector-react";
import  { useState } from "react";
import { $currencyStore } from "../../store/currencyStore";
import classes from './PriceList.module.scss'
const PriceList =()=>{
    const {
        currencyFrom,
        currencyTo,
        exchangeRate
    } = useUnit($currencyStore)

    const fixedAmounts = [1, 5, 10, 25, 50, 100, 500, 1000, 5000];
    
    const [hidden, setHidden] = useState(true);
    
    return(
        <>
        {hidden ? <button className={classes['HideButton']} onClick={() => setHidden(false)}>Hide</button> : <button className={classes['HideButton']} onClick={() => setHidden(true)}>Shov</button>}
        {hidden && <div className={classes['Primary']}>
            {fixedAmounts.map((amount) => (
                <div key={amount}>
                    {amount} {currencyFrom} = {(amount * exchangeRate).toFixed(2)} {currencyTo}
                </div>
            ))}
        </div>}
        </>
    )
}

export default PriceList;