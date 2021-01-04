const Subtraction = ({ terms }) => {

   const output = (terms) => {
      if (terms) {
         if (terms.term_1 && terms.term_2) {
            return true;
         } else return false;
      } else return false;
   }

   return (
      <div>
         {output(terms) && 
            <h2>{terms.term_1} - {terms.term_2}</h2>
         }
         {!output(terms) &&
            <h2>No More Questions</h2>
         }
      </div>
   )
}

export default Subtraction;