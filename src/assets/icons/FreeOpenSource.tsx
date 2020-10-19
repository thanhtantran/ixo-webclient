import React from 'react'

const FreeOpenSource = (props: any): JSX.Element => {
  return (
    <svg
      width={props.width || 36}
      viewBox="0 0 27 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5153 0.0605469C6.35031 0.0605469 0.520508 5.7446 0.520508 12.7305C0.520508 17.9426 3.86992 22.6891 8.85668 24.542C9.06622 24.6212 9.2985 24.6101 9.49992 24.5151C9.70134 24.4185 9.85403 24.2475 9.92063 24.0384L12.3572 16.4523C12.4741 16.0928 12.3133 15.7032 11.9754 15.5226C10.9212 14.9541 10.2666 13.885 10.2666 12.7305C10.2666 10.9836 11.7237 9.563 13.5153 9.563C15.307 9.563 16.764 10.9836 16.764 12.7305C16.764 13.885 16.1094 14.9541 15.0536 15.521C14.7157 15.7032 14.5582 16.0912 14.6719 16.4507L17.1084 24.0368C17.1766 24.2459 17.3293 24.4169 17.5307 24.5135C17.6428 24.5658 17.763 24.5927 17.8848 24.5927C17.9839 24.5927 18.0814 24.5753 18.174 24.5405C23.1607 22.6891 26.5101 17.9426 26.5101 12.7305C26.5101 5.7446 20.6803 0.0605469 13.5153 0.0605469ZM18.3932 22.7302L16.4083 16.5521C17.6444 15.6557 18.3884 14.2414 18.3884 12.7305C18.3884 10.111 16.202 7.97926 13.5153 7.97926C10.8286 7.97926 8.64226 10.111 8.64226 12.7305C8.64226 14.243 9.38622 15.6557 10.6223 16.5521L8.63902 22.7302C4.72108 20.9248 2.14486 17.0066 2.14486 12.7305C2.14486 6.61724 7.24532 1.64429 13.5153 1.64429C19.7837 1.64429 24.8858 6.61724 24.8858 12.7305C24.8858 17.0066 22.3096 20.9248 18.3932 22.7302Z"
        fill={props.fill || '#fff'}
      />
    </svg>
  )
}

export default FreeOpenSource