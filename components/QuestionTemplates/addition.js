const Addition = ({ type, terms }) => {

   const output = terms => {
      if (terms) {
         if (terms.term_1 && terms.term_2) {
            return [terms.term_1, terms.term_2];
         } else return [null, null];
      } else return [null, null];
   }

   return (
      <div>
         <h2>{output(terms)[0]} + {output(terms)[1]}</h2>
      </div>
   )
}

export default Addition;