@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="pull-left">Hello <b>{{ Auth::user()->name }}</b></h3>

                        @if (Auth::user()->role === 'admin')
                            <div class="pull-right">
                                <button class="btn btn-success" v-on:click="shoNewUserModal()">
                                    <i class="fa fa-user-plus"></i> Add user
                                </button>
                            </div>
                        @endif

                    </div>


                    <div class="card-body" style="display: none"
                         v-bind:style="{ display: state.initialized ? 'block' : 'none'}">


                        <div class="loading" v-if="state.is_loading">
                            <div class="loading-box text-center">
                                <i class="fa fa-spin fa-refresh"></i>
                                <p>Please wait</p>
                            </div>
                        </div>

                        @if (session('status'))
                            <div class="alert alert-success">
                                {{ session('status') }}
                            </div>
                        @endif

                        @if (Auth::user()->role === 'admin')
                            @include('admin')
                        @else
                            <blockquote>
                                    Here are your stats
                            </blockquote>
                            <chart-component ref="view-chart" v-bind:chart="state.currentChart"></chart-component>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
