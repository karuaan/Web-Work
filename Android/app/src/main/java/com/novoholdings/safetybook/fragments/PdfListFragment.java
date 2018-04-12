package com.novoholdings.safetybook.fragments;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.novoholdings.safetybook.R;
import com.novoholdings.safetybook.beans.AssignmentBean;
import com.novoholdings.safetybook.database.AssignmentsDao;
import com.novoholdings.safetybook.ui.AssignmentListAdapter;
import com.thoughtbot.expandablerecyclerview.ExpandableRecyclerViewAdapter;

import java.util.ArrayList;

import static com.novoholdings.safetybook.common.AppProperties.YES;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link PdfListFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link PdfListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class PdfListFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private ArrayList<AssignmentBean> overdueList, dueThisWeekList, dueThisMonthList, assignmentsList;
    private RecyclerView recyclerView;
    private ExpandableRecyclerViewAdapter expandableRecyclerViewAdapter;
    private RecyclerView.Adapter recyclerViewAdapter;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    private boolean assignmentsDueSoon;

    private AssignmentsDao assignmentsDao;

    private long groupId;

    public PdfListFragment() {
        // Required empty public constructor
//        setArguments(getActivity().getIntent().getExtras());

    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment PdfListFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static PdfListFragment newInstance(String param1, String param2) {
        PdfListFragment fragment = new PdfListFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);

            //get assignments lists

            //overdue

            //due today

            //due this week

            //due this month
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_pdf_list, container, false);
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState){
        super.onActivityCreated(savedInstanceState);
        assignmentsDueSoon = true;


        Bundle extras = getActivity().getIntent().getExtras();
        groupId=extras.getLong("groupId");

        assignmentsDao = new AssignmentsDao(getContext());
       // assignmentsDao.insertData("Chapter Name", 1, groupId, YES, 900, "11-30-17T00:00.000Z", YES, "filename.pdf", 1, 10);
        assignmentsList = assignmentsDao.getAssignments(groupId);


        recyclerView=(RecyclerView)getView().findViewById(R.id.expandedList);

        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getContext());
        recyclerView.setLayoutManager(linearLayoutManager);

        DividerItemDecoration dividerItemDecoration = new DividerItemDecoration(recyclerView.getContext(),
                linearLayoutManager.getOrientation());
        recyclerView.addItemDecoration(dividerItemDecoration);

        if (assignmentsDueSoon){
            AssignmentListAdapter adapter = new AssignmentListAdapter(getContext(), assignmentsList);
            recyclerView.setAdapter(adapter);

        }
        else{

        }
    }

    public void setWeight(){
        getView().animate().x(0).start();
    }
    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        /*if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }*/
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
}
