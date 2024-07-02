// import { useState } from 'react';
import { IListing } from '../pages/CreateListing';
import { Link } from 'react-router-dom';

type Props = {
  listing: IListing;
};

const Contact = ({ listing }: Props) => {
  const landLord = listing.userRef;
  //   const [message, setMessage] = useState('');
  return (
    landLord && (
      <div className="flex flex-col gap-3">
        <p>
          contact <span className="font-semibold">{landLord.name}</span> for{' '}
          <span className="font-semibold">
            {listing.name.toLocaleLowerCase()}
          </span>
        </p>
        {/* <textarea
          name="message"
          id="message"
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
          className="w-full border outline-none p-3 rounded-lg"
        ></textarea> */}
        <Link
          to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${''}`}
          className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
        >
          Send Message
        </Link>
      </div>
    )
  );
};

export default Contact;
