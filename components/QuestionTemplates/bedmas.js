const Bedmas = ({ terms }) => {

   const output = (terms) => {
      if (terms) {
         if (terms.term_1 && terms.term_2 && terms.term_3 && terms.question_type) {
            return [terms.term_1, terms.term_2, terms.term_3];
         } else return [1, 2, 3];
      } else return [4, 5, 6];
   }

   return (
      <div>
         {terms && terms.question_type === 1 &&
            <h2>{output(terms)[0]} x ({output(terms)[1]} + {output(terms)[2]})</h2>
         }
         {terms && terms.question_type === 2 && 
            <h2>({output(terms)[0]} / {output(terms)[1]}) + {output(terms)[2]}</h2>
         }
         {terms && terms.question_type === 3 &&
            <h2>{output(terms)[0]} x {output(terms)[1]} + {output(terms)[2]}</h2>
         }
      </div>
   );
}

export default Bedmas;